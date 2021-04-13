import axios from "axios";

export const getCredentials = async (roomName) => {
  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    return axios
      .post(`${process.env.REACT_APP_BASE_URL_DEV}/room`, { roomName })
      .then((response) => {
        console.log("getCredentials", response);
        const { apiKey, sessionId, room, token } = response.data;
        return {
          apikey: apiKey,
          sessionId,
          token,
          room,
        };
      })
      .catch((err) => {
        console.log("getCredentials - err", err);
      });
  } else {
    return fetch(`${process.env.REACT_APP_BASE_URL_PROD}dev`)
      .then((x) => x.json())
      .then((y) => {
        return {
          apikey: y.apikey,
          sessionId: y.sessionId,
          token: y.token,
        };
      });
  }
};
