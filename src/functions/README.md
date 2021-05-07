# Server - Lambda functions

This folder contains all the server side code for deploying the application. The backend is deployed using the [Serverless Framework](https://www.serverless.com/).

## Configuration File

Copy the `config.example.json` file to `config.json` and set the variables. 

```
{
  "REGION": "eu-west-2",
  "STAGE": "dev",
  "OPENTOK_API_KEY": "YOUR_NEXMO_API_KEY",
  "OPENTOK_API_SECRET": "YOUR_NEXMO_API_SECRET",
  "AWS_REKOGNITION_MIN_CONFIDENCE": 70
}
```


## API

### Functions

POST `/room`

Get room credentials to connect to the Opentok Session. If the room doesn\'t exist, the function creates a new item on DynamoDB and associates a new Opentok sessionId.

Request Body: 

```
{
    "roomName": "enrico-room"
}
```


Response: 

```
{
    "apiKey": "",
    "sessionId": "",
    "token": "",
    "room": ""
}
```

GET `/moderation`

This functions received a binary encoded from the client. It converts the image to a base64 encoded and send it to the AWS Rekognition endpoint using [DetectModerationLabel](https://docs.aws.amazon.com/rekognition/latest/dg/API_DetectModerationLabels.html) API.

The request body has a `multipart/form-data` Content-Type. 


Response: 

```
{
   "data": {
   		innapropriate: true | false,
   		labels:[{
          Confidence: 99.9010009765625,
          Name: 'Middle Finger',
          ParentName: 'Rude Gestures'
        },
        {
          Confidence: 99.9010009765625,
          Name: 'Rude Gestures',
          ParentName: ''
        }] | [],
   }
}
```
