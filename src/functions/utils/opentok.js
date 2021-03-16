const OpenTok = require("opentok");

const opentok = new OpenTok(
  process.env.OPENTOK_API_KEY,
  process.env.OPENTOK_API_SECRET
);

function createSession() {
  return new Promise((resolve, reject) => {
    opentok.createSession(function (err, session) {
      if (err) {
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(session);
    });
  });
}

function createToken(sessionId) {
  if (sessionId) {
    return opentok.generateToken(sessionId);
  }
  return new Error("SESSION_ID_NOT_VALID");
}

module.exports = {
  createSession,
  createToken,
};
