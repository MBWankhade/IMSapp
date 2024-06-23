import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";


const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
    console.log("user connected");
    console.log("user id :", socket.id);

    socket.on("message", (data) => {
        console.log(data);
        io.emit("recieve-message", data);
    })

    socket.on("display-code", (data) => {
        console.log(data);
        io.emit("recieve-code", data);
    })

    socket.on("input-change", (data) => {
        console.log(data);
        io.emit("recieve-input", data);
    })

    socket.on("output-change", (data) => {
        console.log(data);
        io.emit("recieve-output", data);
    })

    socket.on("change-language", (data) => {
        console.log(data);
        io.emit("recieve-language", data);
    })

    socket.on("text-change", (data) => {
        console.log(data);
        io.emit("recieve-text", data);
    })  

})

app.get("/", (req, res) => {
  res.send("Hello World!");
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});