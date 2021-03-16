import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "./../../hooks/useQuery";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckBox from "@material-ui/icons/CheckBox";
import Error from "@material-ui/icons/Error";
import QualityTestDialog from "../QualityTestDialog";
import { Button, Grid, Typography } from "@material-ui/core";
import { usePublisher } from "../../hooks/usePublisher";
import { AudioSettings } from "../AudioSetting";
import { VideoSettings } from "../VideoSetting";
import { useNetworkTest } from "../../hooks/useNetworkTest";
import { UserContext } from "../../context/UserContext";
import useStyles from "./styles";

export function WaitingRoom() {
  let query = useQuery();
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const { push } = useHistory();
  const defaultLocalAudio = true;
  const defaultLocalVideo = true;
  const userName = query.get("user-name")
    ? query.get("user-name")
    : user.userName;
  const [localAudio, setLocalAudio] = useState(defaultLocalAudio);
  const [localVideo, setLocalVideo] = useState(defaultLocalVideo);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const waitingRoomVideoContainer = useRef();

  const { publisher, initPublisher, destroyPublisher } = usePublisher();

  const {
    connectivityTest,
    qualityTest,
    runNetworkTest,
    stopNetworkTest,
  } = useNetworkTest({
    apikey: process.env.REACT_APP_VIDEO_NETWORKTEST_API_KEY,
    sessionId: process.env.REACT_APP_VIDEO_NETWORKTEST_SESSION,
    token: process.env.REACT_APP_VIDEO_NETWORKTEST_TOKEN,
  });

  const handleAudioChange = React.useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = React.useCallback((e) => {
    setLocalVideo(e.target.checked);
  }, []);

  const handleQualityTestDialogClose = () => {
    setShowQualityDialog(false);
  };

  const handleJoinClick = () => {
    stopNetworkTest(); // Stop network test
    push("/video-room");
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
    console.log("Effect Quality Test", qualityTest);
    if (!qualityTest.loading) {
      setShowQualityDialog(true);
    }
  }, [qualityTest]);

  useEffect(() => {
    runNetworkTest();
  }, [runNetworkTest]);

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
        <Typography variant="h4" component="h2">
          {userName}
        </Typography>
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
        <div className={classes.networkTestContainer}>
          <div className={classes.flex}>
            <div>Connectivity Test:</div>
            <div>
              {connectivityTest.loading ? (
                <CircularProgress size={20} />
              ) : connectivityTest.data && connectivityTest.data.success ? (
                <CheckBox className={classes.green}></CheckBox>
              ) : (
                <Error className={classes.red} />
              )}
            </div>
          </div>
          <div className={classes.flex}>
            <div>Quality Test:</div>
            <div>
              {qualityTest.loading ? (
                <CircularProgress size={20} />
              ) : qualityTest.data ? (
                <CheckBox className={classes.green}></CheckBox>
              ) : (
                <Error className={classes.red} />
              )}
            </div>
          </div>
          <QualityTestDialog
            selectedValue={qualityTest}
            open={showQualityDialog}
            onClose={handleQualityTestDialogClose}
          ></QualityTestDialog>
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
