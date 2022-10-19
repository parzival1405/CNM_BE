let users = [];
let rooms = [];

const SocketServer = (socket) => {
  console.log("new connection");

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
  });

  socket.on("add-user", (user) => {
    const HasUser = users.find((user1) => user1.id === user._id);
    if (HasUser) {
      users.map((user1) => {
        if (user1.id === user._id) {
          user1.socketId = socket.id;
        }
      });
    } else {
      users.push({
        id: user._id,
        socketId: socket.id,
        friends: user.friends,
        username: user.username,
        avatarURL: user.avatarURL,
      });
    }
    console.log(users);
  });

  socket.on("send-msg", async (data) => {
    const UserRemain = data.conversation.member.find(
      (user) => user._id !== data.sender._id
    );
    const user = users.find((user1) => user1.id === UserRemain._id);
    user && socket.to(user.socketId).emit("msg-receive", data);
  });

  //   room

  socket.on("joinRoom", (RoomId) => {
    socket.join(RoomId);
    console.log(socket.id,"join")
    const hadRoom = rooms.find((room) => room.id === RoomId);
    if (!hadRoom) {
      rooms.push({
        id: RoomId,
        socketId: RoomId,
      });
    }
  });

  socket.on("leaveRoom", (RoomId) => {
    socket.leave(RoomId);
    console.log(socket.id,"leave")
  });

  socket.on("sendGroupMessage", async (data) => {
    const room = rooms.find((room) => room.id === data.conversation._id)
    room &&
      socket.broadcast
        .to(room.socketId)
        .emit("groupMessage-receive", data);
  });
};

module.exports = SocketServer;
