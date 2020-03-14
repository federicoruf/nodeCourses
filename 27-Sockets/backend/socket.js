let io;
//this is going to be shared between all the controllers
module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
