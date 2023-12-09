const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (user && bcrypt.compareSync(password, user.password)) {
    res.status(200).json({_id: user.id, name: user.name, email: user.email, token: generateToken(user.id)});
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = await req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const userExists = await User.findOne({email});
  if (userExists) {
    res.status(400);
    throw new Error("User Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({name, email, password: hashedPassword});
  const user = await newUser.save();
  if (user) {
    res.status(200).json({_id: user.id, name: user.name, email: user.email, token: generateToken(user.id)});
  } else {
    res.status(400);
    throw new Error("User Not Created");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({_id: user.id, name: user.name, email: user.email});
});

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
};
module.exports = {registerUser, getAllUsers, getUser, loginUser};
