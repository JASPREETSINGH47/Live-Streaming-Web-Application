require('./server')
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const migration = require("./server");
const cors = require("cors");
const port = 8001;
var fileupload = require("express-fileupload");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const saveMessage = require("./controllers/userControllers").saveMessage;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("sendMessage", async (msg) => {
    try {
      const savedMessage = await saveMessage(msg);

      const responseMsg = {
        id: socket.id,
        text: msg.text,
        timestamp: savedMessage.created_at,
      };

      socket.emit("messageFromServer", responseMsg);
      socket.broadcast.emit("messageFromServer", responseMsg);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   socket.on("joinRoom", (roomName) => {
//     socket.join(roomName);
//     console.log(`User joined room: ${roomName}`);
//   });

//   socket.on("typing", ({ receiverId, senderId }) => {
//     const roomName = [senderId, receiverId].sort().join('_');

//     // socket.to(receiverId).emit("userTyping", { senderId });
//     socket.to(roomName).emit("userTyping", { senderId });
//     console.log(`User ${senderId} is typing to ${receiverId}`);
//   });

//   socket.on("stopTyping", ({ receiverId, senderId }) => {
//     const roomName = [senderId, receiverId].sort().join('_');

//     socket.to(roomName).emit("userStoppedTyping", { senderId });
//     console.log(`User ${senderId} stopped typing to ${receiverId}`);
//   });

//   socket.on("sendMessage", (data) => {
//     const roomName = [data.senderId, data.receiverId].sort().join('_');

// console.log(data, "---------data------")

//     // save_msg(data);

//     // io.to(roomName).emit("receiveMessage", {
//     //   senderId: data.senderId,
//     //   message: data.message,
//     //   image: data.fileUrl,
//     //   timestamp: new Date()
//     // });

//   });

//   socket.on("sendFile", async (data) => {
//     try {
//       const roomName = [data.senderId, data.receiverId].sort().join('_');
//       const fileName = await fileUploads(data.file);
//       const fileUrl = `/uploads/${fileName}`;

//       // Save to your database
//       await save_msg({
//         senderId: data.senderId,
//         receiverId: data.receiverId,
//         message: data.message || 'Sent a file',
//         image: fileUrl,
//         timestamp: new Date()
//       });

//       io.to(roomName).emit("receiveMessage", {
//         senderId: data.senderId,
//         message: data.message || 'Sent a file',
//         image: fileUrl,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       console.error('File upload error:', error);
//       socket.emit("uploadError", { error: 'File upload failed' });
//     }

//   });

//   socket.on("callUser", ({ userToCall, signalData, from }) => {
//     io.to(userToCall).emit("callMade", {
//       signal: signalData,
//       from
//     });
//   });

//   socket.on("answerCall", ({ signal, to }) => {
//     io.to(to).emit("callAccepted", signal);
//   });

//   socket.on("rejectCall", ({ to }) => {
//     io.to(to).emit("callRejected");
//   });

//   socket.on("endCall", ({ to }) => {
//     io.to(to).emit("callEnded");
//   });

//   socket.on("iceCandidate", ({ candidate, to }) => {
//     io.to(to).emit("iceCandidate", candidate);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(port, () => {
  console.log(`🚀 Server is running on port number : ${port}`);
});

module.exports = app;
