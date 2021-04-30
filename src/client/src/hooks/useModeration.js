import { useState } from 'react';
import useInterval from './useInterval';
import useTimeout from './useTimeout';
import useSignal from './useSignal';
import { sendImage } from './../api/sendImage';
import { parseModerationLabels } from './../utils';

const screenshotTimeout = 1000;
const disableTimeout = 10000;

export default function useModeration({
  currentPublisher,
  currentSession,
  isModerationActive,
  setWarnOpenSnackbar,
  setCameraIsInappropriate,
  setInfoOpenSnackbar,
}) {
  /* const [isModerationActive, setIsModerationActive] = useState(false); */
  const [moderationLabels, setModerationLabels] = useState(null);
  const [intervalDelay, setIntervalDelay] = useState(screenshotTimeout);
  const [timeoutDelay, setTimeoutDelay] = useState(disableTimeout);
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);
  useSignal(currentSession, { handleSetInfoOpenSnackbar: setInfoOpenSnackbar });

  useInterval(
    () => {
      if (
        currentPublisher &&
        !currentPublisher.isLoading() &&
        currentPublisher.stream &&
        currentPublisher.stream.hasVideo &&
        isModerationActive
      ) {
        sendImage(currentPublisher.getImgData()).then((res) => {
          if (res && res.error) {
            return;
          }
          if (res && res.data && res.data.labels && res.data.labels.length) {
            console.log('useModeration - res.data', res.data);

            setModerationLabels(parseModerationLabels(res.data.labels));
            setWarnOpenSnackbar(true);
            setIsIntervalRunning(false);
            setIsTimeoutRunning(true);
            setCameraIsInappropriate(res.data.innapropriate);
          }
        });
      }
    },
    isIntervalRunning ? intervalDelay : null
  );

  useTimeout(
    () => {
      // setIsModerationActive(true);
      setIsTimeoutRunning(false);
      setIsIntervalRunning(true);
      setCameraIsInappropriate(false);
    },
    isTimeoutRunning ? timeoutDelay : null
  );

  return {
    isModerationActive,
    moderationLabels,
    /* setIsModerationActive, */
  };
}
