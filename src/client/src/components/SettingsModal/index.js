import React from "react";
import OT from "@opentok/client";
import useStyles from "./styles";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";

export function SettingsModal({ open, onCloseClick, currentPublisher }) {
  const [selectedAudioInput, setSelectedAudioInput] = React.useState();
  const [audioInputs, setAudioInputs] = React.useState([]);
  const mStyles = useStyles();

  function handleCycleCamera() {
    if (currentPublisher) {
      currentPublisher.cycleVideo();
    }
  }

  async function handleAudioInputChange(e) {
    const audioInputs = await fetchAudioInput();
    const [selectedAudioInput] = audioInputs.filter(
      (audioInput) => audioInput.label === e.target.value
    );

    if (selectedAudioInput && currentPublisher) {
      currentPublisher.setAudioSource(selectedAudioInput.deviceId);
      setSelectedAudioInput(selectedAudioInput);
    }
  }

  const fetchAudioInput = React.useCallback(() => {
    return new Promise((resolve, reject) => {
      OT.getDevices((err, devices) => {
        if (!err) {
          console.log("devices", devices);
          const audioInputs = devices.filter(
            (device) => device.kind === "audioInput"
          );
          resolve(audioInputs);
        } else {
          reject(err);
        }
      });
    });
  }, []);

  React.useEffect(() => {
    async function fetch() {
      const audioInputs = await fetchAudioInput();
      if (audioInputs.length > 0) {
        setAudioInputs(audioInputs);
      }
    }
    fetch();
  }, [open, fetchAudioInput]);

  React.useEffect(() => {
    if (currentPublisher) {
      const currentAudioInput = currentPublisher.getAudioSource();
      setSelectedAudioInput(currentAudioInput);
    }
  }, [currentPublisher, open]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can change your microphone and camera input here.
        </DialogContentText>
        <Typography color="primary">Microphone</Typography>
        <FormControl
          margin="dense"
          className={mStyles.formControl}
          hiddenLabel
          fullWidth
        >
          <Select
            value={selectedAudioInput?.label ?? ""}
            onChange={handleAudioInputChange}
            disabled={false}
          >
            {audioInputs.map((audioInput) => (
              <MenuItem key={audioInput.label} value={audioInput.label}>
                {audioInput.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography color="primary">Video</Typography>
        <div className={mStyles.cameraSwitch}>
          <Button
            color="secondary"
            className={mStyles.switchButton}
            onClick={handleCycleCamera}
          >
            Switch Camera
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onCloseClick}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
