"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const fixtures_1 = require("../controllers/fixtures");
const router = express_1.Router();
router
    .get("/", auth_1.default, fixtures_1.view_fixtures)
    .get("/complete", auth_1.default, fixtures_1.view_completed_fixtures)
    .get("/pend", auth_1.default, fixtures_1.view_pending_fixtures)
    .get("/:id", auth_1.default, fixtures_1.getFixture)
    .post("/", [auth_1.default, admin_1.default], fixtures_1.create_fixtures)
    .put("/:id", [auth_1.default, admin_1.default], fixtures_1.update_fixture)
    .delete("/:id", [auth_1.default, admin_1.default], fixtures_1.delete_fixture);
exports.default = router;
//# sourceMappingURL=fixture.js.map