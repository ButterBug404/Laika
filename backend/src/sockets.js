import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

export function initSockets(server) {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("registerUser", ({ userId }) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("joinMunicipality", (municipality) => {
      socket.join(municipality);
      console.log(`Socket ${socket.id} joined municipality: ${municipality}`);
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} with socket ${socket.id} disconnected`);
          break;
        }
      }
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io didn't start");
  }
  return io;
}

export function getConnectedUserIds() {
  return Array.from(connectedUsers.keys());
}

export function getConnectedUsers() {
  return connectedUsers;
}

