const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

//jwt token 확인 module
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { tokenType, tokenValue } = authorization.split(" ");
  console.log(token);

  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용하세요.",
    });
    return;
  }

  try {
    const { email } = jwt.verify(tokenValue, "my-secret-key");
    User.findById(email)
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};
