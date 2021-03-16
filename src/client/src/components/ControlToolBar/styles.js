import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  hidden: {
    display: "none !important",
  },
  toolbarBackground: {
    backgroundColor: grey[600],
    padding: "5px 20px",
    borderRadius: 5,
    transition: "all 0.8s ease-in",
  },
}));
