const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const db = require("./config/db");
const SocketServer = require("./SocketServer");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const conversationRoutes = require("./routes/conversations");
const message = require("./models/message");

const app = express();
require("dotenv").config();

db.connect();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);



const server = app.listen(process.env.PORT || 5000, () =>
  console.log("server runing on port 5000")
);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    Credential: true,
  },
});

io.on("connection", (socket) => {
  SocketServer(socket);
});
