import { useCallback, useEffect, useRef, useState } from 'react';
import { usePublisher } from '../../hooks/usePublisher';
import { ScreenShareButton } from '../ScreenShareButton';
import useModeration from '../../hooks/useModeration';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export function ScreenShare({
  currentSession,
  videoContainer,
  isModerationActive
}) {
  const {
    publisher: screenPublisher,
    publish,
    unpublish,
    pubInitialised
  } = usePublisher();
  const [sharing, setSharing] = useState(false);
  const session = useRef(null);
  const [openWarnSnackbar, setWarnOpenSnackbar] = useState(false);
  const [openInfoSnackbar, setInfoOpenSnackbar] = useState(false);
  const [cameraIsInappropriate, setCameraIsInappropriate] = useState(false);
  const { moderationLabels } = useModeration({
    currentPublisher: screenPublisher,
    currentSession,
    isModerationActive,
    setWarnOpenSnackbar,
    setInfoOpenSnackbar,
    setCameraIsInappropriate
  });

  const handleWarnClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setWarnOpenSnackbar(false);
  };

  const handleInfoClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setInfoOpenSnackbar(false);
  };

  async function toggleShareScreenClick() {
    if (session.current && videoContainer && !sharing) {
      await publish({
        session: session.current,
        containerId: videoContainer.id,
        publisherOptions: { videoSource: 'screen' }
      });
      setSharing(true);
    } else if (session.current && sharing) {
      unpublish({ session: session.current });
      setSharing(false);
    }
  }

  const streamCreatedListener = useCallback(() => setSharing(true), []);
  const streamDestroyedListener = useCallback(() => {
    setSharing(false);
  }, []);

  useEffect(() => {
    if (screenPublisher)
      screenPublisher.on('streamCreated', streamCreatedListener);
    if (screenPublisher)
      screenPublisher.on('streamDestroyed', streamDestroyedListener);

    return function cleanup() {
      if (screenPublisher)
        screenPublisher.off('streamCreated', streamCreatedListener);
      if (screenPublisher)
        screenPublisher.off('streamDestroyed', streamDestroyedListener);
    };
  }, [screenPublisher, streamCreatedListener, streamDestroyedListener]);

  useEffect(() => {
    if (!pubInitialised && sharing) {
      setSharing(false);
    }
  }, [pubInitialised, sharing]);

  useEffect(() => {
    if (!session.current) {
      session.current = currentSession;
    }
    return () => {
      session.current = null;
    };
  }, [currentSession]);

  useEffect(() => {
    if (cameraIsInappropriate && session && screenPublisher) {
      screenPublisher.publishVideo(false);
      session.current.signal({
        data: JSON.stringify({ publisher: screenPublisher.id }),
        type: 'inappropriate_camera_content'
      });
    }
  }, [cameraIsInappropriate, session, screenPublisher]);

  useEffect(() => {
    console.log('[Screenshare]- ', cameraIsInappropriate);
    if (screenPublisher && !cameraIsInappropriate) {
      console.log('[Screenshare]- true', cameraIsInappropriate);
      screenPublisher.publishVideo(true);
    }
  }, [screenPublisher, cameraIsInappropriate]);

  return (
    <>
      <ScreenShareButton
        isScreensharing={sharing}
        onClick={toggleShareScreenClick}
      ></ScreenShareButton>
      <Snackbar
        open={openWarnSnackbar}
        autoHideDuration={10000}
        onClose={handleWarnClose}
      >
        <Alert onClose={handleWarnClose} severity="warning">
          {moderationLabels && (
            <h4 style={{ margin: 0 }}>
              We have detected {moderationLabels.ParentName}{' '}
              {moderationLabels.Name} with Confidence:{' '}
              {moderationLabels.Confidence}
            </h4>
          )}
        </Alert>
      </Snackbar>
      {/*  <Snackbar
        open={openInfoSnackbar}
        autoHideDuration={10000}
        onClose={handleInfoClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleInfoClose} severity="info">
          <h4 style={{ margin: 0 }}>
            We have disabled the participant's video because we have detected
            Inappropriate Content
          </h4>
        </Alert>
      </Snackbar> */}
    </>
  );
}
