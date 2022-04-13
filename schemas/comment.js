const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  nickname: {
    type: String,
  },
  postId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
