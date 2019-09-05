"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const user_1 = require("../models/user");
let user;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.deleteMany({});
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    user = yield supertest_1.default(app_1.default)
        .post("/api/users/login")
        .send({
        email: "charles@gmail.com",
        password: "pass123456"
    });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("SignUp Routes", () => {
    it("user should sign up", () => {
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
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
        return supertest_1.default(app_1.default)
            .get("/api/fixtures")
            .expect("Content-Type", /json/)
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .expect(200);
    });
    it("Users not logged in should not see fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/fixtures")
            .expect("Content-Type", /json/)
            .expect(400);
    });
    it("UnAuthorized Users should not see fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/fixtures")
            .expect("Content-Type", /json/)
            .set("Authorization", `abcd`)
            .expect(401);
    });
    it("Users should see completed fixtures", () => {
        const token = user.body.data.token;
        return supertest_1.default(app_1.default)
            .get("/api/complete")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });
    it("Users should see pending fixtures", () => {
        // console.log(user.body);
        return supertest_1.default(app_1.default)
            .get("/api/complete")
            .set("Authorization", `Bearer ${user.data.token}`)
            .expect(200);
    });
});
//# sourceMappingURL=users.js.map