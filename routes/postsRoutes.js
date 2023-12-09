const express = require("express");
const router = express.Router();

const {createPost, getAllPosts, getUserPosts, commentPost, getAllComments, getPost} = require("../controllers/postsController");
const {verifyToken} = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllPosts);
router.post("/", verifyToken, createPost);
router.post("/reply", verifyToken, commentPost);
router.get("/:postId", getAllComments);
router.get("/singlePost/:postId", getPost);
module.exports = router;
