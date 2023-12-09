const asyncHandler = require("express-async-handler");
const Post = require("../models/postsModel");
const User = require("../models/userModel");

const createPost = asyncHandler(async (req, res) => {
  const {content} = await req.body;
  const newPost = new Post({user: req.user, content, isPost: true});
  const result = await newPost.save();
  res.status(201).json(result);
});

const getAllPosts = asyncHandler(async (req, res) => {
  let posts;
  if (req.query.search) {
    posts = await Post.find({content: {$regex: req.query.search, $options: "i"}}).populate("user");
  } else {
    posts = await Post.find({isPost: true}).populate("user").sort({createdAt: "desc"});
  }

  res.status(200).json(posts);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate("user")
    .populate({path: "comments", populate: {path: "user"}})
    .exec();
  post.comments.map(async (item) => {
    item.user = await User.findById(item.user);
  });
  res.status(200).json(post);
});
const commentPost = asyncHandler(async (req, res) => {
  const {id, content} = await req.body;
  const originalPost = await Post.findById(id);
  if (!originalPost) {
    res.status(400).json({message: "Bad Request"});
    throw new Error("Not found original");
  }
  const newPost = new Post({user: req.user, content, isPost: false});
  const result = await newPost.save();
  originalPost.comments.push(result._id);
  originalPost.save();
  res.status(201).json(result);
});

const getAllComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const comments = await Post.findById(postId).populate("comments");
  res.status(200).json(comments);
});
module.exports = {createPost, getAllPosts, commentPost, getAllComments, getPost};
