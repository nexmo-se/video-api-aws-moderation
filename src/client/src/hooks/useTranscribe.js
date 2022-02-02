import { useRef, useState } from 'react';
import useTimeout from './useTimeout';
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand
} from '@aws-sdk/client-transcribe-streaming';
import { pcmEncodeChunk } from '../utils';
const MicrophoneStream = require('microphone-stream').default;

const timeoutDelay = 10000;

export default function useTranscribe({
  currentPublisher,
  currentSession,
  setMicrophoneIsInappropriate,
  setWarnAudioOpenSnackbar
}) {
  const [profanityDetected, setProfanityDetected] = useState(false);
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);
  const [transcription, setTranscription] = useState(null);
  let micStream = useRef(null);
  let transcribeStreamingClient = useRef(null);
  /* const [isModerationActive, setIsModerationActive] = useState(false); */
  /* const [moderationLabels, setModerationLabels] = useState(null);
  const [intervalDelay, setIntervalDelay] = useState(screenshotTimeout);
  const [timeoutDelay, setTimeoutDelay] = useState(disableTimeout);
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);
  useSignal(currentSession, { handleSetInfoOpenSnackbar: setInfoOpenSnackbar }); */

  const audioStream = async function* (micStream) {
    for await (const chunk of micStream) {
      yield {
        AudioEvent: {
          AudioChunk:
            pcmEncodeChunk(
              chunk
            ) /* pcm Encoding is optional depending on the source */
        }
      };
    }
  };

  const detectProfanity = (transcript) => {
    console.log('detectPRofanity', transcript.indexOf('***') !== -1);
    if (transcript.indexOf('***') !== -1) {
      setTranscription(null);
      setMicrophoneIsInappropriate(true);
      setIsTimeoutRunning(true);
      setWarnAudioOpenSnackbar(true);
      setProfanityDetected(true);
    }
  };

  const startAudioModeration = async () => {
    console.log('startAudioModeration', currentPublisher);
    /* if (micStream.current) {
      // if micStream is defined, we just restar the recording
      micStream.current.playRecording();
      return;
    } */
    if (currentPublisher) {
      transcribeStreamingClient.current = new TranscribeStreamingClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_TRANSCRIBE_ACCESS_KEY,
          secretAccessKey: process.env.REACT_APP_AWS_TRANSCRIBE_ACCESS_SECRET
        }
      });
      // This StartStreamTranscriptionCommandInput object has an AudioStream field that is of type AsyncIterable<AudioStream>
      const audioSource = currentPublisher.getAudioSource();
      const audioMediaStream = new MediaStream();
      audioMediaStream.addTrack(audioSource);
      micStream.current = new MicrophoneStream({ stream: audioMediaStream });
      const encodedAudioStream = await audioStream(micStream.current);
      await sendSpeechStream(encodedAudioStream);
    }
  };

  const handleTextResult = async (response) => {
    for await (const event of response.TranscriptResultStream) {
      if (event.TranscriptEvent) {
        const results = event.TranscriptEvent.Transcript.Results;
        // Print all the possible transcripts
        console.log('result', results);
        results.map((result) => {
          (result.Alternatives || []).map((alternative) => {
            const transcript = alternative.Items.map(
              (item) => item.Content
            ).join(' ');
            console.log(transcript);
            if (!profanityDetected) {
              setTranscription(transcript);
              detectProfanity(transcript);
            }
          });
        });
      }
    }
  };

  const sendSpeechStream = async (encodedAudioStream) => {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      // The encoding used for the input audio. The only valid value is pcm.
      MediaEncoding: 'pcm',
      // The sample rate of the input audio in Hertz. We suggest that you use 8000 Hz for low-quality audio and 16000 Hz for
      // high-quality audio. The sample rate must match the sample rate in the audio file.
      MediaSampleRateHertz: 44100,
      AudioStream: encodedAudioStream,
      VocabularyFilterName: 'ProfanityModerationList'
    });
    try {
      console.log('encodedAudioStream', encodedAudioStream);
      const response = await transcribeStreamingClient.current.send(command);
      handleTextResult(response);
    } catch (e) {
      console.log('transcribeStreamingClient - E', e);
      if (e.name === 'InternalFailureException') {
        /* handle InternalFailureException */
      } else if (e.name === 'ConflictException') {
        /* handle ConflictException */
      }
    } finally {
      /* clean resources like input stream */
    }
  };

  const stopAudioModeration = async () => {
    if (transcribeStreamingClient && transcribeStreamingClient.current) {
      micStream.current.pauseRecording();
      /* await transcribeStreamingClient.current.destroy();
      micStream.current = null;
      transcribeStreamingClient.current = null;
      setTranscription(null); */
    }
  };

  useTimeout(
    () => {
      setIsTimeoutRunning(false);
      setProfanityDetected(false);
    },
    isTimeoutRunning ? timeoutDelay : null
  );

  return {
    startAudioModeration,
    stopAudioModeration,
    transcription,
    profanityDetected
  };
}
