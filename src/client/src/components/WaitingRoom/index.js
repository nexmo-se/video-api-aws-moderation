import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "./../../hooks/useQuery";
import { Button, Grid, TextField } from "@material-ui/core";
import { usePublisher } from "../../hooks/usePublisher";
import { AudioSettings } from "../AudioSetting";
import { VideoSettings } from "../VideoSetting";
import { UserContext } from "../../context/UserContext";
import useStyles from "./styles";

export function WaitingRoom() {
  let query = useQuery();
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const { push } = useHistory();
  const defaultLocalAudio = true;
  const defaultLocalVideo = true;
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [localAudio, setLocalAudio] = useState(defaultLocalAudio);
  const [localVideo, setLocalVideo] = useState(defaultLocalVideo);
  const waitingRoomVideoContainer = useRef();

  const { publisher, initPublisher, destroyPublisher } = usePublisher();

  const handleAudioChange = React.useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = React.useCallback((e) => {
    setLocalVideo(e.target.checked);
  }, []);

  const handleJoinClick = () => {
    if (!userName || !roomName) {
      return;
    }
    push(`/video-room/${roomName}`);
  };

  useEffect(() => {
    console.log("Waiting room - Mount");
    const publisherOptions = {
      publishAudio: defaultLocalAudio,
      publishVideo: defaultLocalVideo,
    };
    if (waitingRoomVideoContainer.current) {
      initPublisher(waitingRoomVideoContainer.current.id, publisherOptions);
    }
  }, [initPublisher, defaultLocalAudio, defaultLocalVideo]);

  useEffect(() => {
    console.log("UseEffect - localAudio");
    if (publisher) {
      publisher.publishAudio(localAudio);
    }
  }, [localAudio, publisher]);

  useEffect(() => {
    console.log("UseEffect - LocalVideo");
    if (publisher) {
      publisher.publishVideo(localVideo);
    }
  }, [localVideo, publisher]);

  useEffect(() => {
    return () => {
      console.log("useEffect destroyPublisher Unmount");
      destroyPublisher();
    };
  }, [destroyPublisher]);

  useEffect(() => {
    setUser({
      defaultSettings: {
        publishAudio: localAudio,
        publishVideo: localVideo,
      },
      userName,
    });
  }, [localAudio, localVideo, userName, setUser]);

  return (
    <div className={classes.waitingRoomContainer}>
      <Grid container direction="column" justify="center" alignItems="center">
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Room Name"
            variant="outlined"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            error={roomName === ""}
            helperText={roomName === "" ? "Type a room name" : " "}
          />
          <TextField
            id="standard-basic"
            label="Username"
            variant="outlined"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            error={userName === ""}
            helperText={userName === "" ? "Type a user name" : " "}
          />
        </form>
        <div
          id="waiting-room-video-container"
          className={classes.waitingRoomVideoPreview}
          ref={waitingRoomVideoContainer}
        ></div>
        <div className={classes.deviceContainer}>
          <AudioSettings
            className={classes.deviceSettings}
            hasAudio={localAudio}
            onAudioChange={handleAudioChange}
          />
          <VideoSettings
            className={classes.deviceSettings}
            hasVideo={localVideo}
            onVideoChange={handleVideoChange}
          />
        </div>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        <Button variant="contained" color="primary" onClick={handleJoinClick}>
          Join Call
        </Button>
      </Grid>
    </div>
  );
}
