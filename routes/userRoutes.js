const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/authMiddleware");

const {registerUser, getAllUsers, getUser, loginUser} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", verifyToken, getUser);

module.exports = router;
