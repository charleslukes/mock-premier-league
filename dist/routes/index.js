"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const signup_1 = require("../controllers/signup");
const router = express_1.Router();
router.post("/api/user/signup", signup_1.signup).post("/api/user/login", login_1.login);
exports.default = router;
//# sourceMappingURL=index.js.map