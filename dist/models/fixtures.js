"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const teams_1 = require("./teams");
const FixtureSchema = ts_mongoose_1.createSchema({
    home: ts_mongoose_1.Type.schema().of(teams_1.Team),
    away: ts_mongoose_1.Type.schema().of(teams_1.Team),
    date: ts_mongoose_1.Type.date(),
    score: ts_mongoose_1.Type.optionalObject(),
    stadium: ts_mongoose_1.Type.string(),
    played: ts_mongoose_1.Type.optionalBoolean()
});
exports.Fixture = ts_mongoose_1.typedModel("Fixture", FixtureSchema);
//# sourceMappingURL=fixtures.js.map