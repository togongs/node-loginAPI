const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  checkDuplicatedEmail,
  checkSignIn,
} = require("../controllers/user.js");
const authmiddlewares = require("../middlewares/auth");

router.post("/signup", signUp, checkDuplicatedEmail, authmiddlewares);
router.post("/signin", signIn, checkSignIn, authmiddlewares);

module.exports = router;
