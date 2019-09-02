"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const FixtureSchema = ts_mongoose_1.createSchema({
    homeTeam: ts_mongoose_1.Type.objectId({ ref: "Team" }),
    awayTeam: ts_mongoose_1.Type.objectId({ ref: "Team" }),
    homeScore: ts_mongoose_1.Type.number({ default: 0 }),
    awayScore: ts_mongoose_1.Type.number({ default: 0 }),
    time: ts_mongoose_1.Type.string(),
    stadium: ts_mongoose_1.Type.string(),
    played: ts_mongoose_1.Type.optionalBoolean({ default: false })
});
exports.Fixture = ts_mongoose_1.typedModel("Fixture", FixtureSchema);
//# sourceMappingURL=fixtures.js.map