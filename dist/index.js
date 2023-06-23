"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routers/auth"));
const contact_1 = __importDefault(require("./routers/contact"));
const chat_1 = __importDefault(require("./routers/chat"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
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
app.get("/", function (_req, res) {
    res.send(`Socket IO Start on Port: ${PORT}`);
});
server.listen(PORT, () => {
    console.log(`Server listening to: ${PORT}\ `);
});
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.connect("mongodb+srv://chatapp:AeM22IpvdO9iWSJl@chatappcluster.5scc0fp.mongodb.net/chatapp_database", function (err) {
    if (err) {
        console.log("Connection error");
        throw err;
    }
    else {
        console.log("Server's initialization completed.");
    }
});
app.use("/auth", auth_1.default);
app.use("/contact", contact_1.default);
app.use("/chat", chat_1.default);
// end
