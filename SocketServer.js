let users = [];
let rooms = [];

const SocketServer = (socket,query) => {
  console.log("new connection");
  // console.log("here" + query._id)

  const HasUser = users.find((user1) => user1.id === query._id);
    if (HasUser) {
      users.map((user1) => {
        if (user1.id === query._id) {
          user1.socketId = socket.id;
        }
      });
    } else {
      users.push({
        id:query._id,
        socketId: socket.id,
        friends:  query.friends,
        username: query.username,
        avatarURL: query.avatarURL,
      });
    }
    console.log(users);

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
  });

  // socket.on("add-user", (user) => {
  //   const HasUser = users.find((user1) => user1.id === user._id);
  //   if (HasUser) {
  //     users.map((user1) => {
  //       if (user1.id === user._id) {
  //         user1.socketId = socket.id;
  //       }
  //     });
  //   } else {
  //     users.push({
  //       id: user._id,
  //       socketId: socket.id,
  //       friends: user.friends,
  //       username: user.username,
  //       avatarURL: user.avatarURL,
  //     });
  //   }
  //   console.log(users);
  // });

  socket.on("send-msg", async (data) => {
    const data2 = JSON.parse(data);
    const UserRemain = data2.conversation.member.find(
      (user) => user._id !== data2.sender._id
    );
    const user = users.find((user1) => user1.id === UserRemain._id);
    user && socket.to(user.socketId).emit("msg-receive", data2);
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
    const data2 = JSON.parse(data);
    const room = rooms.find((room) => room.id === data2.conversation._id)
    room &&
      socket.broadcast
        .to(room.socketId)
        .emit("groupMessage-receive", data2);
  });

  // delete

  socket.on("delete-msg", async (data) => {
    const data2 = JSON.parse(data);
    const UserRemain = data2.conversation.member.find(
      (user) => user._id !== data2.sender._id
    );
    const user = users.find((user1) => user1.id === UserRemain._id);
    user && socket.to(user.socketId).emit("delete-receive", data2);
  });

  socket.on("deleteGroupMessage", async (data) => {
    const data2 = JSON.parse(data);
    const room = rooms.find((room) => room.id === data2.conversation._id)
    room &&
      socket.broadcast
        .to(room.socketId)
        .emit("delete-groupMessage-receive", data2);
  });
};

module.exports = SocketServer;
