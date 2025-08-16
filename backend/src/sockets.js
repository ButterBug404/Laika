import { Server } from "socket.io";

let io;

export function initSockets(server) {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client disconnected:", socket.id);

    socket.on("joinMunicipality", (municipality) => {
      socket.join(municipio);
      console.log(`Socket ${socket.id} joint to municipality: ${municipality}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnect`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io didn't start");
  }
  return io;
}

