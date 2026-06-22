const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const dotenv = require("dotenv");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { socketAuthenticator } = require("./utils/sendToken");

dotenv.config({
  path: "./.env",
});

const app = express();
const port = 5000;

const server = http.createServer(app);

const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_1],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

connectDB();

const onlineUsers = {};

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next),
  );
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.user);
  const userId = socket.user?._id;

  onlineUsers[userId] = socket.id;

  console.log("onlineUsers", onlineUsers);

  socket.on("send-message", async (data) => {
    try {
      const receiverSocketId = onlineUsers[data.receiverId];

      const newMessage = await Message.create({
        senderId: socket.user._id,
        receiverId: data.receiverId,
        message: data.message,
      });

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", newMessage);
      }

      socket.emit("receive-message", newMessage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    delete onlineUsers[userId];
  });
});

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
