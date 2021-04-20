import React, { useEffect, useState } from 'react';
import { sendImage } from './../../api/sendImage';
import useInterval from './../../hooks/useInterval';
import useModeration from './../../hooks/useModeration';

import { Button, Chip, Snackbar, Switch } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import FaceIcon from '@material-ui/icons/Face';

import useStyles from './styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function Moderation({
  currentPublisher,
  currentSession,
  setCameraIsInappropriate,
}) {
  const [openWarnSnackbar, setWarnOpenSnackbar] = useState(false);
  const [openInfoSnackbar, setInfoOpenSnackbar] = useState(false);
  const { isModerationActive, setIsModerationActive } = useModeration({
    currentPublisher,
    currentSession,
    setWarnOpenSnackbar,
    setInfoOpenSnackbar,
    setCameraIsInappropriate,
  });

  const classes = useStyles();

  const handleWarnClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setWarnOpenSnackbar(false);
  };

  const handleInfoClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setInfoOpenSnackbar(false);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsModerationActive(event.target.checked);
  };

  return (
    <>
      <div className={classes.moderationChip}>
        <Switch
          checked={isModerationActive}
          onChange={handleSwitchChange}
          name="moderationActive"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <Chip
          icon={<FaceIcon />}
          label={
            isModerationActive ? 'Moderation Active' : 'Moderation Disabled'
          }
          variant="outlined"
        />
      </div>

      <Snackbar
        open={openWarnSnackbar}
        autoHideDuration={10000}
        onClose={handleWarnClose}
      >
        <Alert onClose={handleWarnClose} severity="warning">
          We have disabled your webcam because we have detected Inappropriate
          Content
        </Alert>
      </Snackbar>
      <Snackbar
        open={openInfoSnackbar}
        autoHideDuration={10000}
        onClose={handleInfoClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleInfoClose} severity="info">
          We have disabled the participant's video because we have detected
          Inappropriate Content
        </Alert>
      </Snackbar>
    </>
  );
}
