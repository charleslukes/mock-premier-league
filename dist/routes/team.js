"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teams_1 = require("../controllers/teams");
const router = express_1.Router();
router
    .get("/api/view-teams/", teams_1.view_teams)
    .post("/api/create-teams", teams_1.create_teams)
    .put("/api/update-team/:id", teams_1.update_team)
    .delete("/api/delete-team/:id", teams_1.delete_team);
exports.default = router;
//# sourceMappingURL=team.js.map