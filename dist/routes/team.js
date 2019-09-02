"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teams_1 = require("../controllers/teams");
const router = express_1.Router();
router
    .get("/", teams_1.view_teams)
    .post("/", teams_1.create_teams)
    .put("/:id", teams_1.update_team)
    .delete("/:id", teams_1.delete_team);
exports.default = router;
//# sourceMappingURL=team.js.map