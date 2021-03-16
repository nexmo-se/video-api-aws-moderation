import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import CheckBox from "@material-ui/icons/CheckBox";
import Error from "@material-ui/icons/Error";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles({
  dialogToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  green: {
    color: green[600],
  },
  red: {
    color: red[600],
  },
});

export const SimpleDialog = ({ selectedValue, onClose, open }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <div className={classes.dialogToolbar}>
          <Typography variant="h6">Quality Test Result</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          Video Supported:
          {selectedValue.data && selectedValue.data.video.supported ? (
            <CheckBox className={classes.green}></CheckBox>
          ) : (
            <Error className={classes.red} />
          )}
        </div>
        <div>
          Video Suggested Resolution:
          {selectedValue.data &&
            selectedValue.data.video.supported &&
            selectedValue.data.video.recommendedResolution}
        </div>
        <div>
          Audio Supported:
          {selectedValue.data && selectedValue.data.audio.supported ? (
            <CheckBox className={classes.green}></CheckBox>
          ) : (
            <Error className={classes.red} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleDialog;
