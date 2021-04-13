import axios from "axios";
import { base64ToBlob } from "../utils";

export const sendImage = async (base64) => {
  let URL = `${process.env.REACT_APP_BASE_URL_DEV}/detect`;
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
      console.log("response", response); // TODO parse response?
      return response;
    })
    .catch((error) => {
      console.log("error", error);
    });
};
