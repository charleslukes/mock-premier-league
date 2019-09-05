import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { User } from "../models/user";

let user: any;
beforeAll(async () => {
  await User.deleteMany({});
});

beforeEach(async () => {
  user = await request(app)
    .post("/api/users/login")
    .send({
      email: "charles@gmail.com",
      password: "pass123456"
    });
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("SignUp Routes", () => {
  it("user should sign up", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "Ojite Precious",
        email: "ojite@gmail.com",
        password: "pass123456"
      })
      .expect(res => {
        expect(Object.keys(res.body.data)).toContain("name");
        expect(Object.keys(res.body.data)).toContain("email");
      });
  });

  it("user should sign up", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "Charles Precious",
        email: "charles@gmail.com",
        password: "pass123456"
      })
      .expect(res => {
        expect(Object.keys(res.body.data)).toContain("name");
        expect(Object.keys(res.body.data)).toContain("email");
      });
  });

  it("should return error if same user sign up again", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "Ojite Precious",
        email: "ojite@gmail.com",
        password: "pass123456"
      })
      .expect(res => {
        expect(res.body.data.message).toBe(`Email already in use`);
      });
  });
});

describe("Login Routes", () => {
  it("users should login", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "charles@gmail.com",
        password: "pass123456"
      })
      .expect(res => {
        expect(res.body.data.message).toBe(`Welcome Charles Precious`);
      });
  });

  it("users should login", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "charles@gmail.c",
        password: "pass123456"
      })
      .expect(res => {
        expect(res.body.data.message).toBe(`email not found`);
      });
  });

  it("users should login", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "charles@gmail.com",
        password: "pass12345"
      })
      .expect(res => {
        expect(res.body.data.message).toBe(`invalid password`);
      });
  });
});

describe("Fixtures Routes", () => {
  it("Authenticated users should see fixtures", () => {
    return request(app)
      .get("/api/fixtures")
      .expect("Content-Type", /json/)
      .set("Authorization", `Bearer ${user.body.data.token}`)
      .expect(200);
  });

  it("Users not logged in should not see fixtures", () => {
    return request(app)
      .get("/api/fixtures")
      .expect("Content-Type", /json/)
      .expect(400);
  });

  it("UnAuthorized Users should not see fixtures", () => {
    return request(app)
      .get("/api/fixtures")
      .expect("Content-Type", /json/)
      .set("Authorization", `abcd`)
      .expect(401);
  });

  it("Users should see completed fixtures", () => {
    const token = user.body.data.token;
    return request(app)
      .get("/api/complete")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("Users should see pending fixtures", () => {
    // console.log(user.body);
    return request(app)
      .get("/api/complete")
      .set("Authorization", `Bearer ${user.data.token}`)
      .expect(200);
  });
});
