import { Typography } from "@material-ui/core";
import useStyles from "./styles";

export function MeetingName({ meetingName }) {
  const classes = useStyles();
  return (
    <div className={`${classes.container} OT_ignore`}>
      <Typography variant="h4" component="h2">
        {meetingName}
      </Typography>
    </div>
  );
}
