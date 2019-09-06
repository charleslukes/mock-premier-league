"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const signup_1 = require("../controllers/signup");
const signout_1 = require("../controllers/signout");
const router = express_1.Router();
router
    .post("/signup", signup_1.signup)
    .post("/login", login_1.login)
    .get("/signout", signout_1.signout);
exports.default = router;
//# sourceMappingURL=user.js.map