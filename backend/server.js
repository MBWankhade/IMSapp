import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db/connectDb.js";
import User from "./db/model.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";



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

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectdb();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);


app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (user) {
      if (user.password === password) {
        const token = jwt.sign({
          id: user._id,
        }, process.env.JWT_SECRET);
        res.cookie("token", token);
        return res.status(200).send({message:"login success", data: token});
      } else {
        return res.status(401).send("password incorrect");
      }
    } else {
      return res.status(404).send("user not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const u = await User.findOne({ username: username });

    if (u) {
      return res.status(409).send("username already exists ");
    }

    const user = new User({
      name,
      email,
      username,
      password,
    });

    await user.save();

    const token = jwt.sign({
      id: user._id,
    }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.status(201).send({message:"user registered successfully", data: token});
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});


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