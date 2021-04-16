const { detectModerationLabels } = require("../rekognition/detectModeration");
const multipart = require("aws-lambda-multipart-parser");
const { parse } = require("./../utils/fileParser");

function parseModerationResult(moderationLabels) {
  // todo need to map the results and send back to frontend
  /* moderationResult {
      ModerationLabels: [
        {
          Confidence: 99.9010009765625,
          Name: 'Middle Finger',
          ParentName: 'Rude Gestures'
        },
        {
          Confidence: 99.9010009765625,
          Name: 'Rude Gestures',
          ParentName: ''
        }
      ],
      ModerationModelVersion: '4.0'
    } */
    /* moderationLabels.ModerationLabels [
      { Confidence: 75.32240295410156, Name: 'Suggestive', ParentName: '' },
      {
        Confidence: 75.32240295410156,
        Name: 'Barechested Male',
        ParentName: 'Suggestive'
      }
    ] */
    
  // todo save on Dynamo
  console.log(
    "moderationLabels.ModerationLabels",
    moderationLabels.ModerationLabels
  );
  let detectedInappropriateImage = false;
  if (moderationLabels && moderationLabels.ModerationLabels.length) {
    detectedInappropriateImage = true;
  }
  return detectedInappropriateImage;
}

module.exports.handler = async (event) => {
  // here should I have a base64Image

  try {
    var event2 = event;
    if (event.isBase64Encoded) {
      event2.body = Buffer.from(event.body, "base64").toString("binary");
    }
    var files = multipart.parse(event2, true);

    const moderationResult = await detectModerationLabels(files.file.content);
    const moderation = {
      isInappropriate: parseModerationResult(moderationResult),
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(moderation),
    };
  } catch (err) {
    console.log("Err - ", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
