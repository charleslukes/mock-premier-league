"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe("User Routes", () => {
    it("user should sign up", () => {
        return supertest_1.default(app_1.default)
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
//# sourceMappingURL=index_routes.js.map