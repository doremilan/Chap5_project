const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

// // MongoDB 연결
// const mongoose = require("mongoose");
// var db = mongoose
// .connect('mongodb+srv://eorb1230:eorb1230@cluster0.emaap.mongodb.net/nodenode?ret' +
// 'ryWrites=true&w=majority',{
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
//         ignoreUndefined: true
//     })
//     .then(() => console.log('MongoDB 연결완료'))
//     .catch(err =>{console.log(err);
// });

mongoose.connect("mongodb://localhost:27017/team7-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/cors-test", (req, res) => {
  res.send("hi");
});

io.on("connection", function (socket) {
  console.log("user is connecting");

  socket.on("user-send", function (data) {
    socket.join("room1"); //채팅방 생성 & 입장하기
  });

  socket.on("room1-send", function (data) {
    io.to("room1").emit("broadcast", data); //room1에만 메시지 보내기
  });

  socket.on("user-send", function (data) {
    console.log(data);
    //메시지 수신은 socket.on
    io.emit("broadcast", data); //서버에서 유저에게 메시지 전송은 io.emit: 사이트 접속한 모든 유저에게 메시지를 보내줌 broadcast 한다고함 (user-send라는 이름으로 데이터를 받으면 서버가 message라는 이름으로 보낼데이터룰 전달)
    io.to(socket.id).emit("broadcast", data); //특정 유저에게만 데이터 전송할 때 io.to().emit
  });
});

const commentsRouter = require("./routes/comment");
const usersRouter = require("./routes/user");
const postsRouter = require("./routes/post");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", [commentsRouter, usersRouter, postsRouter]);

app.listen(port, () => {
  console.log(port, "Server is listening...");
});
