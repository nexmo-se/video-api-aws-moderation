import { MicButton } from "../MicButton";
import { VideoButton } from "../VideoButton";
import { ScreenShare } from "../ScreenShare";
import { ChatButton } from "../ChatButton";
import { SettingsButton } from "../SettingsButton";
import { useCallback, useEffect, useRef, useState } from "react";
import useStyles from "./styles";

export const ControlToolBar = ({
  className,
  hasAudio,
  hasVideo,
  handleMicButtonClick,
  handleVideoButtonClick,
  handleToggleScreenShare,
  handleToggleChat,
  currentSession,
  currentPublisher,
  videoContainer,
}) => {
  // This bar should include mic,camera, chat, screenshare, settings, endCall
  const [visible, setVisible] = useState(true);
  const classes = useStyles();
  const hiddenTimeoutTimer = 3000;
  let hiddenTimeout = useRef();

  const setHiddenTimeout = useCallback(() => {
    hiddenTimeout.current = setTimeout(() => {
      setVisible(false);
    }, hiddenTimeoutTimer);
  }, []);

  function handleMouseEnter() {
    clearTimeout(hiddenTimeout.current);
    setVisible(true);
  }

  function handleMouseLeave() {
    setHiddenTimeout();
  }

  useEffect(() => {
    setHiddenTimeout();
  }, [setHiddenTimeout]);

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${classes.toolbarBackground} ${
          !visible ? classes.hidden : ""
        }`}
      >
        <ChatButton onClick={handleToggleChat}></ChatButton>
        <MicButton
          hasAudio={hasAudio}
          onClick={handleMicButtonClick}
        ></MicButton>
        <VideoButton
          hasVideo={hasVideo}
          onClick={handleVideoButtonClick}
        ></VideoButton>
        <ScreenShare
          currentSession={currentSession}
          videoContainer={videoContainer}
        ></ScreenShare>
        <SettingsButton currentPublisher={currentPublisher} />
      </div>
    </div>
  );
};
