const express = require("express");
const Posts = require("../schemas/post.js");
const router = express.Router();
// const upload = require('./upload');
const authMiddleware = require("../middlewares/auth-middleware.js");

//전체 조회
router.get("/postList", async (req, res, next) => {
  try {
    const postList = await Posts.find({}).sort("-createdAt").exec();
    res.json({ postList });
  } catch (error) {
    res.status(400).send({
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
    next(error);
  }
});

//상세조회
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const postList = await Posts.find({ postId }).exec();
    res.json({ postList });
  } catch (error) {
    res.status(400).send({
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  }
});

//마이페이지
router.get("/mypage", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    if (user.email) {
      const postList = await Posts.find({ email: user.email })
        .sort("-createdAt")
        .exec();
      res.json({ mylist });
    }
    res.status(400).send({ result: "로그인된 회원이 아닙니다" });
  } catch (error) {
    res.status(400).send({
      errorMessage: "조회에 실패하였습니다.",
    });
  }
});

//검색조회
router.get("/search", async (req, res) => {
  try {
    /*  const keyword = req.query.item */
    /*  const postList = await Posts.find({$item:{$search: keyword}})  */
    //array생성
    let option = [];
    //조건문
    if (option) {
      //정규식(item키값은 밸류 req.qurey.item설정)
      option = [{ item: new RegExp(req.query.item) }];
    } else {
      const err = new Error("검색 옵션이 없습니다.");
      err.status = 400;
      throw err;
    }
    //search 한글자라도 연관된게 있으면 다 찾아온다.
    const postList = await Posts.find({ $or: option })
      .sort("-createdAt")
      .exec();
    res.json({ postList });
  } catch (error) {
    res.status(400).send({
      errorMessage: "검색어 조회에 실패하였습니다.",
    });
  }
});

// router.post('/image', upload.single('image'), async (req, res) => {
//     const file = await req.file;
//     //console.log(file);
//     try {
//         const result = await file.location;
//         //console.log(result);
//         //사진경로가있는 주소를  image이라는 이름으로 저장
//         res.status(200).json({ image: result });
//     } catch (e) {
//         //console.log(e);
//     }
// });

//작성
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content, item, image, createdAt } = req.body;
    const { user } = res.locals;
    console.log("바디:", req.body);
    console.log("유저:", res.locals);

    //공백값 확인
    if (
      title !== null &&
      title !== "" &&
      content !== null &&
      content !== "" &&
      item !== null &&
      item !== ""
    ) {
      const posts = new Posts({
        title,
        content,
        item,
        image,
        createdAt,
        email: user.email,
        profile: user.profile,
        nickname: user.nickname,
      });
      await posts.save();
      res.status(200).send({
        result: "게시글 작성에 성공하였습니다.",
      });
    }
  } catch (error) {
    res.status(400).send({
      errorMessage: "게시글 작성에 실패하였습니다.",
    });
  }
});

//수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    //파라미터 값
    const { postId } = req.params;
    //유저 인증
    const { user } = res.locals;
    // console.log("포스트:", postId);
    console.log("유저:", user);
    const { title, content, item, image, createdAt } = req.body;
    const email1 = user["email"];
    const email2 = await Posts.findOne({ _id: postId }).exec();
    console.log("email1:", email1);
    console.log("email2:", email2);
    //동일 유저 확인 조건
    if (email1 !== email2.email) {
      res.send({ result: "권한이 없음" });
    } else {
      await Posts.updateOne(
        { _id: postId },
        { $set: { title, content, item, image, createdAt } }
      );
      res.send({ result: "success" });
    }
  } catch (error) {
    res.status(400).send({
      errorMessage: "게시글 수정에 실패하였습니다.",
    });
  }
});
//삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    console.log("유저:", user);
    const email1 = user["email"];
    const email2 = await Posts.findOne({ _id: postId }).exec();
    console.log("email1:", email1);
    console.log("email2:", email2);
    if (email1 !== email2.email) {
      res.send({ result: "권한이 없습니다." });
    } else {
      await Posts.deleteOne({ _id: postId });
      res.status(200).send({ result: "삭제가 되었습니다." });
    }
  } catch (error) {
    res.status(400).send({
      errorMessage: "게시글 삭제에 실패하였습니다.",
    });
  }
});

module.exports = router;
