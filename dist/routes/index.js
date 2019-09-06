"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fixture_1 = __importDefault(require("./fixture"));
const team_1 = __importDefault(require("./team"));
const user_1 = __importDefault(require("./user"));
const search_1 = __importDefault(require("./search"));
const express_1 = require("express");
const router = express_1.Router();
router.use("/fixtures", fixture_1.default);
router.use("/teams", team_1.default);
router.use("/users", user_1.default);
router.use("/search", search_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map