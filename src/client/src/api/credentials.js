import axios from "axios";

export const getCredentials = async (roomName) => {
  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    return axios
      .post(`${process.env.REACT_APP_BASE_URL_DEV}/room`, { roomName })
      .then((response) => {
        const { apiKey, sessionId, room, token } = response.data;
        return {
          apikey: apiKey,
          sessionId,
          token,
          room,
        };
      })
      .catch((err) => {
        return {
          apikey: "",
          sessionId: "",
          token: "",
          room: "",
        };
      });
  } else {
    return axios
      .post(`${process.env.REACT_APP_BASE_URL_PROD}/room`, { roomName })
      .then((response) => {
        const { apiKey, sessionId, room, token } = response.data;
        return {
          apikey: apiKey,
          sessionId,
          token,
          room,
        };
      })
      .catch((err) => {
        return {
          apikey: "",
          sessionId: "",
          token: "",
          room: "",
        };
      });
  }
};
