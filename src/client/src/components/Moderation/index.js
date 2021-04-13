import React, { useEffect, useState } from "react";
import {sendImage} from "./../../api/sendImage";
import useInterval from "./../../hooks/useInterval";

import { Button, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function Moderation({ currentPublisher }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // TODO need to access the publisher or just pass the image?

  useInterval(() => {
    if (currentPublisher && isEnabled) {
      sendImage(currentPublisher.getImgData()).then((res) => {
        // Show a dialog?
        // todo handle when to show a dialog + stop the Moderation as it's not needed
        setIsEnabled(false);
        setOpenSnackbar(true);
      });
    }
  }, 1000);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning">
        We have disabled your webcam
      </Alert>
    </Snackbar>
  );
}
