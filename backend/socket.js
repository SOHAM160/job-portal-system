const { Server } = require("socket.io");
const Message = require("./models/Message.model");
const Conversation = require("./models/Conversation.model");

let io;
const userSockets = new Map(); // userId -> socketId mapping

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // When a user connects, they emit "setup" with their user ID
    socket.on("setup", (userData) => {
      if (!userData || !userData._id) return;
      socket.join(userData._id);
      userSockets.set(userData._id, socket.id);
      socket.emit("connected");
      
      // Notify others they are online (simple presence)
      io.emit("user online", userData._id);
    });

    // Send a new message
    socket.on("new message", async (newMessageRecieved) => {
      // newMessageRecieved should be the populated message object
      const chat = newMessageRecieved.conversationId;
      if (!chat) return console.log("chat not defined");

      // We emit the message to the receiver's room (which is their user id)
      const receiverId = newMessageRecieved.receiver._id || newMessageRecieved.receiver;
      if (!receiverId) return;

      socket.in(receiverId.toString()).emit("message recieved", newMessageRecieved);
    });

    // Join a specific chat room if needed
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");
      // Find and remove user from map
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          io.emit("user offline", userId);
          break;
        }
      }
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIo };
