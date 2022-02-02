import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { getCredentials } from '../../api/credentials';
import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import { ControlToolBar } from '../ControlToolBar';
import { MeetingName } from '../MeetingName';
import { Moderation } from '../Moderation';
import useStyles from './styles';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router';

export function VideoRoom() {
  let { roomName } = useParams();
  const { user } = useContext(UserContext);
  const videoContainer = useRef();
  const { publisher, publish, pubInitialised } = usePublisher();
  const { session, createSession, connected } = useSession({
    container: videoContainer
  });

  const [credentials, setCredentials] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);
  const [isModerationActive, setIsModerationActive] = useState(false);
  const [cameraIsInappropriate, setCameraIsInappropriate] = useState(false);
  const [microphoneIsInappropriate, setMicrophoneIsInappropriate] =
    useState(false);
  const classes = useStyles();

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
  }, []);

  useEffect(() => {
    if (cameraIsInappropriate && session && publisher) {
      publisher.publishVideo(false);
      setHasVideo(false);
      session.current.signal({
        data: JSON.stringify({ publisher: publisher.id }),
        type: 'inappropriate_camera_content'
      });
    }
  }, [cameraIsInappropriate, session, publisher]);

  useEffect(() => {
    console.log('microphoneIsInappropriate', microphoneIsInappropriate);
    if (microphoneIsInappropriate && session && publisher) {
      console.log('microphoneIsInappropriate2', microphoneIsInappropriate);
      publisher.publishAudio(false);
      setHasAudio(false);
      session.current.signal({
        data: JSON.stringify({ publisher: publisher.id }),
        type: 'inappropriate_microphone_content'
      });
    }
  }, [microphoneIsInappropriate, session, publisher]);

  useEffect(() => {
    getCredentials(roomName).then(({ apikey, sessionId, token }) => {
      setCredentials({ apikey, sessionId, token });
    });
  }, [roomName]);

  useEffect(() => {
    if (credentials) {
      createSession(credentials);
    }
  }, [createSession, credentials]);

  useEffect(() => {
    if (
      session.current &&
      connected &&
      !pubInitialised &&
      videoContainer.current
    ) {
      // todo It might be better to change state of this component.
      publish({
        session: session.current,
        containerId: videoContainer.current.id,
        publisherOptions: { ...user.defaultSettings, name: user.userName }
      }).then(() => {});
    }
  }, [publish, session, connected, pubInitialised, user]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher]);

  useEffect(() => {
    if (publisher && !microphoneIsInappropriate) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher, microphoneIsInappropriate]);

  useEffect(() => {
    if (publisher && !cameraIsInappropriate) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher, cameraIsInappropriate]);

  return (
    <div
      id="video-container"
      className={classes.container}
      ref={videoContainer}
    >
      <MeetingName meetingName={'Meeting'} />
      <ControlToolBar
        className={classes.controlToolbar}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
        handleMicButtonClick={toggleAudio}
        handleVideoButtonClick={toggleVideo}
        currentSession={session.current}
        currentPublisher={publisher}
        isModerationActive={isModerationActive}
        videoContainer={videoContainer.current}
      ></ControlToolBar>
      <Moderation
        currentPublisher={publisher}
        currentSession={session.current}
        setCameraIsInappropriate={setCameraIsInappropriate}
        setMicrophoneIsInappropriate={setMicrophoneIsInappropriate}
        isModerationActive={isModerationActive}
        setIsModerationActive={setIsModerationActive}
      />
    </div>
  );
}
