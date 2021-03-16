import React from "react";

import ScreenShare from "@material-ui/icons/ScreenShare";
import StopScreenShare from "@material-ui/icons/StopScreenShare";
import { IconButton } from "@material-ui/core";

export function ScreenShareButton({ isScreensharing, onClick }) {
  return (
    <IconButton edge="start" color="inherit" aria-label="mic" onClick={onClick}>
      {isScreensharing ? (
        <StopScreenShare fontSize="inherit" />
      ) : (
        <ScreenShare fontSize="inherit" />
      )}
    </IconButton>
  );
}
