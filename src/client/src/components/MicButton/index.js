import React from "react";

import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { IconButton } from "@material-ui/core";

export function MicButton({ hasAudio, onClick }) {
  return (
    <IconButton edge="start" color="inherit" aria-label="mic" onClick={onClick}>
      {hasAudio ? (
        <MicIcon fontSize="inherit" />
      ) : (
        <MicOffIcon fontSize="inherit" />
      )}
    </IconButton>
  );
}
