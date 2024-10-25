const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");

// connect MongoDB

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URL || "mongodb://localhost:27017/express-crud-app"
  );
});

describe("User Authentication API", () => {
  it("should register a new user", async () => {
    const userData = {
      name: "Soliman",
      email: "solo@solo.so",
      password: "123123123",
    };

    const res = await request(app).post("/auth/register").send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should log in an existing user and return a token", async () => {
    const loginData = {
      email: "solo@solo.so",
      password: "123123123",
    };

    const res = await request(app).post("/auth/login").send(loginData);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });
});

// disconnect MongoDB
afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});
