const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
