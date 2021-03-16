import React from "react";

import Chat from "@material-ui/icons/Chat";
import { IconButton } from "@material-ui/core";

export function ChatButton({ onClick }) {
  return (
    <IconButton 
      color="inherit"
      aria-label="mic" 
      onClick={onClick}
    >
      <Chat fontSize="inherit" />
    </IconButton>
  );
}
