import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { VideoRoom } from "./components/VideoRoom";
import { WaitingRoom } from "./components/WaitingRoom";
import { UserContext } from "./context/UserContext";
import { useMemo, useState } from "react";

function App() {
  const [user, setUser] = useState({
    defaultSettings: {
      publishAudio: true,
      publishVideo: true,
    },
  });

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <Router>
      <UserContext.Provider value={value}>
        <Switch>
          <Route path="/video-room/:roomName" component={VideoRoom} />
          <Route path="/waiting-room" component={WaitingRoom} />
          <Route path="/">
            <Redirect to="/waiting-room" />
          </Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
