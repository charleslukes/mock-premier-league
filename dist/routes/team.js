"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const teams_1 = require("../controllers/teams");
const router = express_1.Router();
router
    .get("/", auth_1.default, teams_1.view_teams)
    .post("/", [auth_1.default, admin_1.default], teams_1.create_teams)
    .put("/:id", [auth_1.default, admin_1.default], teams_1.update_team)
    .delete("/:id", [auth_1.default, admin_1.default], teams_1.delete_team);
exports.default = router;
//# sourceMappingURL=team.js.map