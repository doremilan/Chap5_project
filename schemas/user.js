const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // null이 들어갈수 없음
    unique: true,
  },
  nickname: {
    type: String,
  },
  password: {
    type: String,
  },
  profile: {
    type: String,
  },
});

UserSchema.virtual("_Id").get(function () {
  return this._id.toHexString(); // 가상의 아이디를 만들어서
});

UserSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);
