"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const TeamSchema = ts_mongoose_1.createSchema({
    name: ts_mongoose_1.Type.string(),
    team_email: ts_mongoose_1.Type.string(),
    coach: ts_mongoose_1.Type.string(),
    country: ts_mongoose_1.Type.string(),
    founded: ts_mongoose_1.Type.number(),
    stadium_name: ts_mongoose_1.Type.string(),
    stadium_capacity: ts_mongoose_1.Type.string()
});
exports.Team = ts_mongoose_1.typedModel("Team", TeamSchema);
//# sourceMappingURL=teams.js.map