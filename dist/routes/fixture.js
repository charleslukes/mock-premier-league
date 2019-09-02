"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fixtures_1 = require("../controllers/fixtures");
const router = express_1.Router();
router
    .get("/", fixtures_1.view_fixtures)
    .get("/one", fixtures_1.getFixture)
    .post("/", fixtures_1.create_fixtures)
    .put("/:id", fixtures_1.update_fixture)
    .delete("/:id", fixtures_1.delete_fixture);
exports.default = router;
//# sourceMappingURL=fixture.js.map