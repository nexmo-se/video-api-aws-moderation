const { Room, VideoModeration } = require("./dynamodb");

async function getRoom(roomName) {
  if (!roomName) {
    throw new Error("[createRoom] - Room Name undefined");
  }
  const roomToGet = `ROOM#${roomName}`;
  const key = {
    room: roomToGet,
    roomName: roomToGet,
  };
  const result = await Room.get(key);
  if (result && result.Item) {
    return result.Item;
  }
  return null;
}

async function createRoom(roomName, sessionId) {
  if (!roomName) {
    throw new Error("[createRoom] - Room Name undefined");
  }
  const roomToSave = `ROOM#${roomName}`;
  const roomItem = {
    room: roomToSave,
    roomName: roomToSave,
    sessionId,
  };

  const options = {
    conditions: [
      {
        attr: "room",
        exists: false,
      },
    ],
  };

  return Room.put(roomItem, options);
}

/* async function createRoom(roomName, sessionId) {
  if (!roomName) {
    throw new Error("[createRoom] - Room Name undefined");
  }
  const roomItem = {
    room: "ROOM",
    roomName,
    sessionId
  };

  const roomSessionItem = {
    roomName,
    sessionId
  };


  // return Room.put(item);
  const result = await VideoModeration.transactWrite(
    [
      Room.putTransaction(roomItem),
      RoomSession.putTransaction(roomSessionItem, { conditions: { exists: false }})
    ],{ 
      capacity: 'total',
      metrics: 'size',
    }
  )
} */

module.exports = {
  getRoom,
  createRoom,
};
