import { useCallback, useEffect } from 'react';

export default function useSignal(
  session,
  { handleSetInfoOpenSnackbar, handleSetInfoMicrophoneOpenSnackbar }
) {
  const sendSignalToAll = useCallback((session, payload) => {
    session.signal(payload, function (error) {
      if (error) {
        console.log(
          '[useSignal] - Error (' + error.name + '): ' + error.message
        );
      } else {
        console.log('[useSignal] - Signal Sent');
      }
    });
  }, []);

  useEffect(() => {
    if (session) {
      session.on('signal', (event) => {
        console.log('Signal sent from connection ' + event.from.connection);
        switch (event.type) {
          case 'signal:inappropriate_camera_content':
            if (
              session.connection &&
              event.from.connectionId !== session.connection.id
            ) {
              handleSetInfoOpenSnackbar(true);
            }
            break;
          case 'signal:inappropriate_microphone_content':
            if (
              session.connection &&
              event.from.connectionId !== session.connection.id
            ) {
              handleSetInfoMicrophoneOpenSnackbar(true);
            }
            break;
          default:
        }
      });
    }

    return () => {
      if (session) {
        session.off('signal');
      }
    };
  }, [session, handleSetInfoOpenSnackbar]);
}
