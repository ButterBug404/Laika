import { getIO } from "../sockets.js";

export function notifyMunicipality(municipality, petData) {
  const io = getIO();
  io.to(municipality).emit("dogLost", petData);
}

