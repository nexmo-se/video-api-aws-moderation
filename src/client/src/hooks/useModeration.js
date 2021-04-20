import { useState } from 'react';
import useInterval from './useInterval';
import useTimeout from './useTimeout';
import useSignal from './useSignal';
import { sendImage } from './../api/sendImage';

const screenshotTimeout = 1000;
const disableTimeout = 10000;

export default function useModeration({
  currentPublisher,
  currentSession,
  setWarnOpenSnackbar,
  setCameraIsInappropriate,
  setInfoOpenSnackbar,
}) {
  const [isModerationActive, setIsModerationActive] = useState(true);
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
        isModerationActive
      ) {
        sendImage(currentPublisher.getImgData()).then(res => {
          if (res && res.error) {
            return;
          }
          if (res && res.isInappropriate) {
            // setIsModerationActive(false);
            setWarnOpenSnackbar(true);
            setIsIntervalRunning(false);
            setIsTimeoutRunning(true);
            setCameraIsInappropriate(true);
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
    setIsModerationActive
  };
}
