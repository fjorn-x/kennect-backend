const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }

  if (!token) {
    res.status(401);
    throw new Error("No Token");
  }
});

module.exports = {verifyToken};
