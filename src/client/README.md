# Web application

This web application has been developed in ReactJS starting from `create-react-app` (https://reactjs.org/docs/create-a-new-react-app.html). 

## Installation

1. Run `npm install`
2. Copy the `.env.example` to `.env` and fill the needed value.
3. Run `npm start` to start the development server

### Env Variables

The env variables are needed to configure the web application. Set the environment based on your use-case and the base URL for the development and prod environment.

```
REACT_APP_ENVIRONMENT=development
REACT_APP_BASE_URL_DEV=https://xxxxxx.execute-api.{region}.amazonaws.com/dev
REACT_APP_BASE_URL_PROD=

```

## Architecture

The entry point of the project is the `src/client/index.js` file. The index file imports the **App** file which containts the Routes and Component definition. 

### Pages

The routes are defined in the App.js file. The code uses the `react-router-dom` module to declare the routes. There are two main routes:

- **Waiting room**: in this page the user can set up his microphone and camera settings and run a precall test. Then, he can join the video call 
- **VideoRoom**: in this page the user connects to the session, publishes his stream and subscribe to each of the streams inside the room.

Please notice that the use can **directly** navigate to the VideoRoom page. There is not authentication implemented in the sample code.

#### Waiting Room

The waiting room page creates a publisher (using **UsePublisher** hook) to display the video feed. Using the AudioSettings and VideoSettings components, the user can mute or unmute the microphone and the camera.

It's also possible to set the username using a query param in the URL of the page. The query param is `user-name`. So if the user navigates to `waiting-room?user-name=JohnDoe`, the waiting room page will set the username to `John Doe`.

Lastly, there is a React effect that runs the network test when the page is loaded. The network test is handled by a custom Hook, `useNetworkTest`. The network test runs two different tests: **testConnectivity** and **testQuality**. If the user joins the call before the tests has been completed, the `useNetworkTest` hook will abort them.

For more information please check here: [https://github.com/opentok/opentok-network-test-js](https://github.com/opentok/opentok-network-test-js)

#### Video Room

Firstly, the video room components uses the `useSession` and `usePublisher` Hooks to handle the Opentok logic. The `useEffect` at component mount get the credentials to connect to the room (**getCredentials** function). Once the credentials are set by the hook, another effect is fired which will create a new session, calling `OT.initSession` and `session.connect` sequentially. 

Then, after the session creation, the next effect will trigger the publish function from the `usePublisher` hook.

Secondly, the video room includes the `Chat` component. The chat component uses the [Opentok Signal](https://tokbox.com/developer/sdks/js/reference/SignalEvent.html) to send and receive messages.

Lastly, the `ControlToolBar` components includes the buttons used during the videocall: mute/unmute microphone and camera, screensharing and chat. 

### React Context

The only context used in this App is the UserContext that stores the username, localAudio and localVideo preferences. 

### React Hooks

This project uses React Hooks, in particular it uses React **Hooks** and **Contexts**: 

#### UseSession

The `src/hooks/useSession.js` hook handles the Session object of the Opentok library. The main functions are: 

- **createSession**: given the credentials, the function connects to the Opentok servers, add the event listeners (`onStreamCreated` and `onStreamDestroyed`).
- **destroySession**: disconnects the current session.
- **subscribe**: given a stream and extra subscriber options, it subscribes to it

#### UsePublisher

The `src/hooks/usePublisher.js` file defines the Publisher object.
The main functions are: 
 
- `initPublisher`: requests the mic and camera access to the browser and inits the publisher object. Then, the function - 
- `publish`: publishes the stream into the session.
- `unpublish`: unpublishes the local stream from the Session and stops the mediaTracks (mic and camera).

### API 

The api folder is for non rendering methods. It's used to talk directly to the API endpoints (server) or Firebase. The following requests are implemented: get credentials and send image.
