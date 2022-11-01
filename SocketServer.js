let users = [];
let rooms = [];

const SocketServer = (socket, query) => {
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
      id: query._id,
      socketId: socket.id,
      friends: query.friends,
      username: query.username,
      avatarURL: query.avatarURL,
    });
  }

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
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
    const UserRemain = data2.conversation.member.filter(
      (user) => user._id !== data2.sender._id
    );
    UserRemain.forEach((element, index) => {
      const user = users.find((user1) => user1.id === element._id);
      user && socket.to(user.socketId).emit("msg-receive", data2);
    });
  });

  socket.on("delete-msg", async (data) => {
    const data2 = JSON.parse(data);
    const UserRemain = data2.conversation.member.filter(
      (user) => user._id !== data2.sender._id
    );
    UserRemain.forEach((element, index) => {
      const user = users.find((user1) => user1.id === element._id);
      user && socket.to(user.socketId).emit("delete-receive", data2);
    });
  });

  socket.on("addConversation", (data) => {
    const data2 = JSON.parse(data);
    const UserRemain = data2.member.filter(
      (user) => user._id !== data2.createdBy._id
    );
    UserRemain.forEach((element, index) => {
      const user = users.find((user1) => user1.id === element._id);
      user && socket.to(user.socketId).emit("addConversation-receive", data2);
    });
  });
};

module.exports = SocketServer;
