const Joi = require("joi");

module.exports = {
  // 회원가입
  signUpSchema: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .min(3)
      .max(15),
    password: Joi.string()
      .required()
      .min(8)
      .max(16)
      .pattern(/^[a-z0-9_-]{5,20}$/),
  }),
  // 로그인
  signInSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  // 이메일 중복체크
  duplicatedEmailSchema: Joi.object({
    email: Joi.string().required().min(1),
  }),
};
