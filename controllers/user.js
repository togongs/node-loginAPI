const { User } = require("../models");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");
const { signUpSchema, signInSchema, duplicatedEmailSchema } = require("./joi");

// 회원가입
const signUp = async (req, res, next) => {
  try {
    const { email, password } = await signUpSchema.validateAsync(req.body);
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const exEmail = await User.findOne({ where: { email } });
    if (!exEmail) {
      await User.create({ email, password: hashedPassword });
      return res.status(200).send({ result: "success", msg: "회원가입 완료" });
    } else {
      return res
        .status(400)
        .send({ result: "success", msg: "이미 등록된 회원입니다" });
    }
  } catch (err) {
    next(err);
  }
};
// 로그인
const signIn = async (req, res, next) => {
  try {
    const { email, password } = await signInSchema.validateAsync(req.body);
    const exUser = await User.findOne({ where: { email } });
    console.log(exUser);
    // 이메일이 없는 경우
    if (!exUser) {
      return res
        .status(400)
        .send({ result: "success", msg: "가입된 이메일 없음" });
    }
    // 비밀번호가 일치하지 않는 경우
    if (!bcrypt.compareSync(password, exUser.password)) {
      return res
        .status(400)
        .send({ result: "success", msg: "비밀번호가 일치하지 않음" });
    } else {
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY);
      res.status(200).send({ result: "success", msg: "로그인 성공", token });
    }
  } catch (err) {
    next(err);
  }
};
// 로그인체크
const checkSignin = async (req, res, next) => {
  const user = res.locals.user;
  try {
    const exUser = await User.findOne({ where: { email: user.email } });
    if (exUser) {
      res.status(200).send({ result: "success", msg: "로그인 중" });
    } else {
      res.status(400).send({ result: "fail", msg: "로그인 필요" });
    }
  } catch (err) {
    next(err);
  }
};
// 이메일 중복체크
const checkDuplicatedEmail = async (req, res, next) => {
  try {
    const { email } = await duplicatedEmailSchema.validateAsync(req.body);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).send({ result: "fail", msg: "이메일 중복" });
    } else {
      res.status(200).send({ result: "success", msg: "이메일 중복 아님" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { signUp, signIn, checkDuplicatedEmail, checkSignin };
