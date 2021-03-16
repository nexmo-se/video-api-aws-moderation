import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(
  (theme) => ({
    formControl: {
      marginBottom: theme.spacing(2),
    },
    cameraSwitch: {
      display: "flex",
      alignItems: "center",
    },
    switchButton: {
      marginRight: theme.spacing(2),
    },
  }),
  { index: 1 }
);
