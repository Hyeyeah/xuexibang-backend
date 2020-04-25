const request = require("supertest");
const { User } = require("../../models/user");
const { Course } = require("../../models/course");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Course.remove({});
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/courses")
      .set("x-auth-token", token)
      .send({
        name: "course1",
        number: "1",
        university: mongoose.Types.ObjectId(),
        major: mongoose.Types.ObjectId()
      });
  };

  beforeEach(() => {
    token = new User({ isAdmin: true }).generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
