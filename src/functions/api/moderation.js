const AWS = require("aws-sdk");
const Rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
  // here should I have a base64Image
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({}),
  };
};
