"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
afterAll(() => {
    mongoose_1.default.connection.close();
});
describe("User Routes", () => {
    it("user should sign up", () => {
        return supertest_1.default(app_1.default)
            .post("/api/users/signup")
            .send({
            name: "Ojite Precious",
            email: "ojite@gmail.com",
            password: "pass123456"
        })
            .expect(res => {
            console.log(res.body);
            expect(Object.keys(res.body.data)).toContain("name");
            expect(Object.keys(res.body.data)).toContain("email");
        });
    });
    // it("should return error if same user sign up again", () => {
    //   return request(app)
    //     .post("/api/users/signup")
    //     .send({
    //       name: "Ojite Precious",
    //       email: "ojite@gmail.com",
    //       password: "pass123456"
    //     })
    //     .expect(`Email already in use`);
    // });
});
//# sourceMappingURL=index_routes.js.map