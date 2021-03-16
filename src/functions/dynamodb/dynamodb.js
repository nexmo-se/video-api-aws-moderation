const { Table, Entity } = require("dynamodb-toolbox");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

// Instantiate a table
const VideoModeration = new Table({
  // Specify table name (used by DynamoDB)
  name: "VideoModerationTable",

  // Define partition and sort keys
  partitionKey: "pk",
  sortKey: "sk",

  // Add the DocumentClient
  DocumentClient,
});

const Room = new Entity({
  // Specify entity name
  name: "Room",
  // Define attributes
  attributes: {
    room: { partitionKey: true }, // flag as partitionKey
    roomName: { sortKey: true }, // flag as sortKey
    sessionId: "string",
  },
  table: VideoModeration,
});

const RoomSession = new Entity({
  // Specify entity name
  name: "RoomSession",
  // Define attributes
  attributes: {
    roomName: { partitionKey: true }, // flag as partitionKey
    sessionId: { sortKey: true }, // flag as sortKey
  },
  table: VideoModeration,
});

module.exports = {
  Room,
  RoomSession,
  VideoModeration,
};
