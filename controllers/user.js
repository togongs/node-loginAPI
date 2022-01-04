const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const { signUpSchema, signInSchema, duplicatedEmailSchema } = require("./joi");

module.exports = {
  // 회원가입
  signUp: async (req, res, next) => {
    try {
      const { email, password } = await signUpSchema.validateAsync(req.body);
      const hashedPassword = await bcrypt.hash(password, saltRound);
      const exEmail = await User.findOne({ where: { email } });
      if (!exEmail) {
        await User.create({ email, password: hashedPassword });
        // 시퀄라이즈 raw query
        // const User = await sequelize.query(
        //   "insert into User (email, password) values (:email, :password)",
        //   {
        //     replacements: { email: email, password: hashedPassword },
        //     type: QueryTypes.INSERT,
        //   }
        // );
        return res
          .status(200)
          .send({ result: "success", msg: "회원가입 완료" });
      } else {
        return res
          .status(400)
          .send({ result: "success", msg: "이미 등록된 회원입니다" });
      }
    } catch (err) {
      next(err);
    }
  },
  // 로그인
  signIn: async (req, res, next) => {
    try {
      const { email, password } = await signInSchema.validateAsync(req.body);
      const exUser = await User.findOne({ where: { email } });
      // 시퀄라이즈 raw query
      // const exUser = await sequelize.query(
      //   "select * from User where email = :email",
      //   {
      //     replacements: { email: email,},
      //     type: QueryTypes.INSERT,
      //   }
      // );
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
  },
  // 로그인체크
  checkSignIn: async (req, res, next) => {
    const user = res.locals.user;
    try {
      const exUser = await User.findOne({ where: { email: user.email } });
      // const exUser = await sequelize.query(
      //   "select * from User where email = :email",
      //   {
      //     replacements: { email: email,},
      //     type: QueryTypes.INSERT,
      //   }
      // );
      if (exUser) {
        res.status(200).send({ result: "success", msg: "로그인 중" });
      } else {
        res.status(400).send({ result: "fail", msg: "로그인 필요" });
      }
    } catch (err) {
      next(err);
    }
  },
  // 이메일 중복체크
  checkDuplicatedEmail: async (req, res, next) => {
    try {
      const { email } = await duplicatedEmailSchema.validateAsync(req.body);
      const user = await User.findOne({ where: { email } });
      // const user = await sequelize.query(
      //   "select * from User where email = :email",
      //   {
      //     replacements: { email: email,},
      //     type: QueryTypes.INSERT,
      //   }
      // );
      if (!user) {
        res.status(400).send({ result: "fail", msg: "이메일 중복" });
      } else {
        res.status(200).send({ result: "success", msg: "이메일 중복 아님" });
      }
    } catch (err) {
      next(err);
    }
  },
};
