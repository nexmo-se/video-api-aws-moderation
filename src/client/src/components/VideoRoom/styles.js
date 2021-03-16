import { makeStyles } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
  },
  controlToolbar: {
    position: "absolute",
    bottom: 10,
    display: "flex",
    flexDirection: "row",
    left: "50%",
    transform: "translate(-50%)",
    zIndex: 10,
    height: "60px",
    width: "100%",
    justifyContent: "center",
  },
}));
