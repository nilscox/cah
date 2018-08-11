const WSServer = require('socket.io');
const sharedSession = require('express-socket.io-session');

module.exports = (http, session) => {
  const io = new WSServer(http);

  io.use(sharedSession(session, {
    autoSave: true,
  }));

  io.on('connection', socket => {

  });
};
