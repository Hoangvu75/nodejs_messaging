import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import authRouter from "./routers/auth";
import contactRouter from "./routers/contact";
import chatRouter from "./routers/chat";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`a user connected ${Date().toLocaleString()}`);
  socket.on("chat request", (msg) => {
    socket.broadcast.emit("chat response", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", function (_req: any, res: any) {
  res.send(`Socket IO Start on Port: ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Server listening to: ${PORT}\ `);
});

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://chatapp:AeM22IpvdO9iWSJl@chatappcluster.5scc0fp.mongodb.net/chatapp_database",
  function (err: any) {
    if (err) {
      console.log("Connection error");
      throw err;
    } else {
      console.log("Server's initialization completed.");
    }
  }
);

app.use("/auth", authRouter);
app.use("/contact", contactRouter);
app.use("/chat", chatRouter);
