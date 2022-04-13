const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

//jwt token 확인 module
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
<<<<<<< HEAD
  console.log(req.headers);
  const { tokenType, tokenValue } = authorization.split(" ");
=======
  console.log(authorization);
  const [tokenType, tokenValue] = (authorization || "").split(" ");
>>>>>>> f44660e553f3630a03d8e7f40e0b95fdc775f896
  console.log(tokenType, tokenValue);

  if (!tokenValue || tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요.",
    });
    return;
  }

  try {
    console.log(tokenValue);
    const { email } = jwt.verify(tokenValue, "my-secret-key");
    User.findById(email)
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
