const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const bcrypt = require("bcrypt");

// vailidation check
function vaildCheck(data) {
  //data = req.body; --> 회원가입을 위해 민경님이 넘겨준값
  var result = { result: true, msg: "" };
  // 공백 or 빈값 check --> undefined, null, ""

  //한글,영문,숫자 3~15자리 가능.
  var nicknameReg = /^[a-z]+[a-z0-9]{2,15}$/g; //한글 추가 필요
  var emailReg =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if (
    data.nickname == undefined ||
    data.nickname == null ||
    data.nickname == ""
  ) {
    result.msg = "닉네임을 입력해주세요."; // 회원가입 API --> res.send로 전달
    result.result = false;
    return result;
  } else if (!nicknameReg.test(data.nickname)) {
    result.msg = "닉네임은 3자이상 및 알파벳과 숫자만 사용 가능합니다.";
    result.result = false;
    return result;
  } else if (
    data.email == undefined ||
    data.email == null ||
    data.email == ""
  ) {
    result.msg = "이메일을 입력해주세요.";
    result.result = false;
    return result;
  } else if (!emailReg.test(data.email)) {
    result.msg = "이메일을 형식이 올바르지 않습니다.";
    result.result = false;
    return result;
  } else if (data.password.length < 5 && data.confirmPassword < 5) {
    result.msg = "비밀번호는 최소 4자 이상이어야 합니다.";
    result.result = false;
    return result;
  } else if (!data.password.search(data.nickname)) {
    result.msg = "비밀번호는 닉네임과 같은 값이 포함될 수 없습니다.";
    result.result = false;
    return result;
  } else if (data.password !== data.confirmPassword) {
    result.msg = "비밀번호를 확인하세요";
    result.result = false;
    return result;
  }
  return result;
}

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { email, nickname, password } = req.body; // 한번 req찍어보기
  // console.log("-------->",req);
  // console.log({ email, nickname, password })
  //req.body = {email:undefined , nickname:"" , password:""};
  //req.body ={};

  //validation check
  var returnData = vaildCheck(req.body);

  if (!returnData.result) {
    res.status(400).send({
      errorMessage: "가입 실패",
    });
    return;
  }

  const user_list = await User.find({ email });
  if (user_list.length) {
    res.status(400).send({
      // status 안보내도되요.
      errorMessage: "이미 가입된 이메일 입니다.",
    });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const newuser = new User({ email, nickname, password: hashed });
  await newuser.save();
  res.status(201).send({
    Message: "회원가입 완료!", // res.send({ result:true,false})
  });
});

router.post("/login", async (req, res) => {
  // console.log("req",req)
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();
  console.log(user);

  const check = await bcrypt.compare(password, user[0].password);

  // const hashedPw = await bcrypt.hash(password, 10);
  // console.log(hashedPw)
  // const correctPassword = bcrypt.compareSync(password, user.password)
  // const passwordOk = bcrypt.compare("비밀번호", encryted)

  if (!user || !check) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }
  // 사용자가 있을 경우 토큰값이랑 true보냄
  const token = jwt.sign({ userInfo: user }, "my-secret-key"); // 글을 작성할떄 회원아이디만 가지고있느게 아니라
  res.send({
    token,
    result: true,
  });
});

router.get("/islogin", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  res.status(200).send({
    user, // 로그인한 사람의 정보를 필요하면 islogin을 호출하세요
  });
});

// router.post("/loginInfo", async (req, res) => {
//   const { token } = req.body;
//   res.json({
//     userInfo: jwt.decode(token),
//   });
// });

// router.get('/logout')e

module.exports = router; //router를 모듈로 내보낸다.
