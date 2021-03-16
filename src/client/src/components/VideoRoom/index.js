import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCredentials } from "../../api/credentials";
import { usePublisher } from "../../hooks/usePublisher";
import { useSession } from "../../hooks/useSession";
import { useChat } from "../../hooks/useChat";
import { ControlToolBar } from "../ControlToolBar";
import { Chat } from "../Chat";
import { MeetingName } from "../MeetingName";
import useStyles from "./styles";
import { UserContext } from "../../context/UserContext";

export function VideoRoom() {
  const { user } = useContext(UserContext);
  const videoContainer = useRef();
  const { publisher, publish, pubInitialised } = usePublisher();
  const { session, createSession, connected } = useSession({
    container: videoContainer,
  });
  const { open, toggleChat, messages, sendMessage } = useChat({
    session: session.current,
  });
  const [credentials, setCredentials] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);
  const classes = useStyles();

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
  }, []);

  const sendChatMessage = (message) => {
    sendMessage({ message });
  };

  useEffect(() => {
    getCredentials("").then(({ apikey, sessionId, token }) => {
      setCredentials({ apikey, sessionId, token });
    });
  }, []);

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
        publisherOptions: { ...user.defaultSettings, name: user.userName },
      });
    }
  }, [publish, session, connected, pubInitialised, user]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher]);

  return (
    <div
      id="video-container"
      className={classes.container}
      ref={videoContainer}
    >
      <MeetingName meetingName={"Meeting"} />
      <Chat
        messages={messages}
        open={open}
        handleToggleChat={toggleChat}
        sendChatMessage={sendChatMessage}
      ></Chat>
      <ControlToolBar
        className={classes.controlToolbar}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
        handleMicButtonClick={toggleAudio}
        handleVideoButtonClick={toggleVideo}
        currentSession={session.current}
        currentPublisher={publisher}
        videoContainer={videoContainer.current}
        handleToggleChat={toggleChat}
      ></ControlToolBar>
    </div>
  );
}
