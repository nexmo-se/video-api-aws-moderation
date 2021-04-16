const AWS = require("aws-sdk");
const Rekognition = new AWS.Rekognition();
const config = require("../config.json");

function detectModerationLabels(imageBuffer) {
  var params = {
    Image: {
      Bytes: imageBuffer,
    },
    MinConfidence: Number(config.AWS_REKOGNITION_MIN_CONFIDENCE),
  };
  return Rekognition.detectModerationLabels(params).promise();
}

module.exports = {
  detectModerationLabels,
};
