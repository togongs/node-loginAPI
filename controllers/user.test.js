jest.mock("../models/user");
const User = require("../models/user");
const { signIn, signUp } = require("./user");

// describe는 테스트를 그룹화
describe("signIn", () => {
  const req = {
    body: { email: "jcw@add.com" },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("success를 응답해야 함", async () => {
    User.findOne.mockReturnValue(
      // 가짜 반환값 지정 메소드
      Promise.resolve({
        signIn(email) {
          return Promise.resolve(true);
        },
      })
    );
    await signIn(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({ result: "success" });
  });

  test("사용자를 못찾으면 res.status(400).send('ok')를 호출함", async () => {
    User.findOne.mockReturnValue(null);
    await signIn(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith({ result: "success" });
  });

  test("DB에서 에러가 발생하면 next(error)를 호출함", async () => {
    const err = "테스트용 에러";
    User.findOne.mockReturnValue(Promise.reject(err));
    await signIn(req, res, next);
    expect(next).toBeCalledWith(err);
  });
});
