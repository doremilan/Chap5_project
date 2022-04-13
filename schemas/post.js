const mongoose = require("mongoose");
//mongodb 데어터 타입 지정
const postsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  // profile: {
  //   type: String,
  //   // required: true,
  // },
  nickname: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
});
//기존에 저장되는 id값을 postsId로이용
postsSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
postsSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Posts", postsSchema);
