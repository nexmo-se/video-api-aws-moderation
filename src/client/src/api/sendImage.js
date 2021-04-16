import axios from "axios";
import { base64ToBlob } from "../utils";

export const sendImage = async (base64) => {
  if (!base64) {
    return;
  }
  let URL = `${process.env.REACT_APP_BASE_URL_DEV}/moderation`;
  const blob = base64ToBlob(base64, "image/png");
  let data = new FormData();

  data.append("name", "image");
  data.append("file", blob);

  let config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios
    .post(URL, data, config)
    .then((response) => {
      if (response && response.data) {
        return response.data;
      }
      return null;
    })
    .catch((error) => {
      return { error: true };
    });
};
