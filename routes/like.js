const express = require("express");
const Likes = require("../schmas/like.js");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
//좋아요 조회
router.get("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Likes.find({ postId });
    const countLikes = likes.length;
    res.json({ countLikes });
  } catch (error) {
    res.status(400).send({
      errorMessage: "실패하였습니다.",
    });
  }
});
//추가
router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.locals;
    const like = await Likes.find({ postId, email: userId.email });
    if (like) {
      res.status(404).send({ result: "게시글 작성에 실패하였습니다." });
    }
    await Likes.craet({ postId, email: userId.email });
    res.status(200).send({ result: "좋아요" });
  } catch (error) {
    res.status(400).send({
      errorMessage: "실패하였습니다.",
    });
  }
});
//취소
router.delete("/:postId/likes", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals;
    await Likes.deleteOne({ postId, emil: userId.email });
    res.status(200).send({ result: "취소" });
  } catch (error) {
    res.status(400).send({
      errorMessage: "실패하였습니다.",
    });
  }
});

module.exports = router;
