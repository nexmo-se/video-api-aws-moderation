import React from "react";

import Mic from "@material-ui/icons/Mic";
import Switch from "@material-ui/core/Switch";

export const AudioSettings = React.memo(
  ({ hasAudio, onAudioChange, className }) => {
    return (
      <div className={className}>
        <Mic />
        <div>Microphone</div>
        <Switch
          checked={hasAudio}
          onChange={onAudioChange}
          name="AudioToggle"
        />
      </div>
    );
  }
);
