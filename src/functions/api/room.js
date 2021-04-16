const { getRoom, createRoom } = require("../dynamodb/query");
const { createSession, createToken } = require("../utils/opentok");

async function handleRoomCreation(roomName) {
  if (!roomName) {
    throw new Error("[handleRoomCreation] - Room Name undefined");
  }
  try {
    let roomItem = await getRoom(roomName);
    let sessionId = null;
    if (!roomItem) {
      // need to create room into DynamoDB and then sessionId
      const session = await createSession();
      sessionId = session.sessionId;
      roomItem = await createRoom(roomName, sessionId);
    } else {
      sessionId = roomItem.sessionId;
    }

    let token = createToken(sessionId);

    return { sessionId, room: roomName, token };
  } catch (err) {
    console.log("[handleRoomCreation] - Something went wrong", err);
    throw err;
  }
}

module.exports.handler = async (event) => {
  let body = null;
  try {
    if (process.env.IS_LOCAL === "true") {
      body = event.body;
    } else {
      body = JSON.parse(event.body);
    }

    if (!body.roomName) {
      throw new Error("MALFORMED_DATA_INPUT - ROOM NAME NOT VALID");
    }
    const { room, sessionId, token } = await handleRoomCreation(
      body.roomName.trim().toLowerCase()
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        room,
        sessionId,
        token,
        apiKey: process.env.OPENTOK_API_KEY,
      }),
    };
  } catch (err) {
    console.log("Err - ", err);
    return {
      statusCode: 500,
    };
  }
};
