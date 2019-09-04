import request from "supertest";
import app from "../app";

describe("User Routes", () => {
  it("user should sign up", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "Charles Lukes",
        email: "charleslukes@gmail.com",
        password: "pass123456",
        isAdmin: true
      })
      .expect(res => {
        expect(Object.keys(res.body)).toContain("name");
        expect(Object.keys(res.body)).toContain("email");
        expect(Object.keys(res.body)).toContain("password");
        expect(Object.keys(res.body)).toContain("isAdmin");
      });
  });
});
