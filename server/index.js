import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import "dotenv/config";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

//create server express
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

//create server http for socket.io, y give permision cors
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origins: "*" } });

app.use(cors());
//create middleware morgan(log of pettition at terminal)
app.use(morgan("dev"));

//escuchar eventos de conexión de sockets
io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(message);
    //sent message to all sockets
    socket.broadcast.emit("message", { body: message, from: socket.id });
  });
});

//le decimos que va a serrvir cuando pidan archivos estáticos, en este caso porque estamos subiendo el front y back en el mismo repositorio
app.use(express.static(join(__dirname, "../client")))

console.log(__dirname + "/client/build")

//app esta engolbado en un nuevo objeto de servidor (server), que será quien escuche las peticiones
server.listen(process.env.PORT || 4000, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
