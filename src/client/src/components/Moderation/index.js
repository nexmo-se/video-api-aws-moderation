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
  isModerationActive,
  setIsModerationActive,
}) {
  const [openWarnSnackbar, setWarnOpenSnackbar] = useState(false);
  const [openInfoSnackbar, setInfoOpenSnackbar] = useState(false);
  const { moderationLabels } = useModeration({
    currentPublisher,
    currentSession,
    isModerationActive,
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
          {moderationLabels && (
            <h4 style={{ margin: 0 }}>
              We have detected {moderationLabels.ParentName}{' '}
              {moderationLabels.Name} with Confidence:{' '}
              {moderationLabels.Confidence}
            </h4>
          )}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openInfoSnackbar}
        autoHideDuration={10000}
        onClose={handleInfoClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleInfoClose} severity="info">
          <h4 style={{ margin: 0 }}>
            We have disabled the participant's video because we have detected
            Inappropriate Content
          </h4>
        </Alert>
      </Snackbar>
    </>
  );
}
