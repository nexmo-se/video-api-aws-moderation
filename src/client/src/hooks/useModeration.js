/* import { useEffect, useState } from "react";


import sendImage from "./../api/sendImage";

const screenshotTimeout = 1000;

export default function useModeration() {
  const [isActive, setIsActive] = useState(true);

  // todo transform this to a custom hook as I need to handl;e the timeout?
  // TODO need to access the publisher or just pass the image?

  const startModeration = (publisher) => {};

  useEffect(() => {
    useInterval(() => {
      sendScreenshot(base64Image).then((res) => {});
    }, screenshotTimeout);
  }, []);
}
 */