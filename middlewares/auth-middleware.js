const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

//jwt token 확인 module
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  const [tokenType, tokenValue] = (authorization || "").split(" ");
  console.log(tokenType, tokenValue);

  if (!tokenValue || tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요.",
    });
    return;
  }

  try {
    console.log(tokenValue);
    const user = jwt.verify(tokenValue, "my-secret-key");
    const email = user.email;
    console.log("email", email);
    User.findOne(email)
      .exec()
      .then((user) => {
        res.locals.user = user;
        console.log("1", res.locals.user);
        next();
      });
    console.log("2", res.locals.user);
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};
