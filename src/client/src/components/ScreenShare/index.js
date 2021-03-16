import { useCallback, useEffect, useRef, useState } from "react";
import { usePublisher } from "../../hooks/usePublisher";
import { ScreenShareButton } from "../ScreenShareButton";

export function ScreenShare({ currentSession, videoContainer }) {
  const {
    publisher: screenPublisher,
    publish,
    unpublish,
    pubInitialised,
  } = usePublisher();
  const [sharing, setSharing] = useState(false);
  const session = useRef(null);

  async function toggleShareScreenClick() {
    if (session.current && videoContainer && !sharing) {
      await publish({
        session: session.current,
        containerId: videoContainer.id,
        publisherOptions: { videoSource: "screen" },
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
      screenPublisher.on("streamCreated", streamCreatedListener);
    if (screenPublisher)
      screenPublisher.on("streamDestroyed", streamDestroyedListener);

    return function cleanup() {
      if (screenPublisher)
        screenPublisher.off("streamCreated", streamCreatedListener);
      if (screenPublisher)
        screenPublisher.off("streamDestroyed", streamDestroyedListener);
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

  return (
    <ScreenShareButton
      isScreensharing={sharing}
      onClick={toggleShareScreenClick}
    ></ScreenShareButton>
  );
}
