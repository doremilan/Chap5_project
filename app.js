const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

// MongoDB 연결
var db = mongoose
  .connect(
    "mongodb+srv://eorb1230:eorb1230@cluster0.emaap.mongodb.net/team7-db?ret" +
      "ryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
      ignoreUndefined: true,
    }
  )
  .then(() => console.log("MongoDB 연결완료"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/cors-test", (req, res) => {
  res.send("hi");
});

const commentsRouter = require("./routes/comment");
const usersRouter = require("./routes/user");
const postsRouter = require("./routes/post");

//미들웨어 동작시 동작 시간
const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//미들웨어 요청시각표시
app.use(requestMiddleware);
app.use("/api", [commentsRouter, usersRouter, postsRouter]);

app.listen(port, () => {
  console.log(port, "Server is listening...");
});
