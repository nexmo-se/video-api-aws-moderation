import React from "react";

import VideoCam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import { IconButton } from "@material-ui/core";

export function VideoButton({ hasVideo, onClick }) {
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="videoCamera"
      onClick={onClick}
    >
      {hasVideo ? (
        <VideoCam fontSize="inherit" />
      ) : (
        <VideocamOff fontSize="inherit" />
      )}
    </IconButton>
  );
}
