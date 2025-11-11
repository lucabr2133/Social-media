import { io } from "socket.io-client";

const URL = "http://localhost:3000"; // tu servidor backend
export const socket = io(URL, {
      withCredentials: true,
  autoConnect: false, // control manual de la conexión
});