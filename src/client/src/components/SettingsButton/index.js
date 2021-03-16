import React from "react";

import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton } from "@material-ui/core";
import { SettingsModal } from "../SettingsModal";

export function SettingsButton({ currentPublisher }) {
  const [ open, setOpen ] = React.useState(false);

  function toggleOpen(){
    setOpen((prev) => !prev);
  }

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="settings"
        onClick={toggleOpen}
      >
        <SettingsIcon />
      </IconButton>
      <SettingsModal 
        currentPublisher={currentPublisher}
        onCloseClick={toggleOpen}
        open={open}
      />
    </>
  );
}
