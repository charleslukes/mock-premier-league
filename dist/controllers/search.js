"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fixtures_1 = require("../models/fixtures");
const teams_1 = require("../models/teams");
exports.searchTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let value;
    try {
        if (+id) {
            const team = yield teams_1.Team.find({ founded: id });
            if (team.length > 0)
                return res.status(200).json({ data: { message: team } });
            if (!!team) {
                return res.status(400).json(`Invalid Input`);
            }
        }
        else {
            value = new RegExp(id, "gi");
            const team = yield teams_1.Team.find().or([
                { name: { $regex: value } },
                { coach: { $regex: value } },
                { stadium_name: { $regex: value } }
            ]);
            if (team.length > 0)
                return res.status(200).json({ data: { message: team } });
            if (!!team) {
                return res.status(400).json({ data: { message: `Invalid Input` } });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ error });
    }
});
exports.searchFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let value = new RegExp(id, "gi");
    try {
        const fixtures = yield fixtures_1.Fixture.find().populate("homeTeam awayTeam ", "name coach link -_id");
        const getFixtures = fixtures.filter(elem => {
            if (value.test(elem.homeTeam["name"]) ||
                value.test(elem.awayTeam["name"])) {
                return elem;
            }
        });
        if (getFixtures.length > 0)
            return res.status(200).json({ data: { message: getFixtures } });
        if (!!getFixtures) {
            return res.status(400).json({ data: { message: `Invalid Input` } });
        }
    }
    catch (error) {
        return res.status(400).json({ error });
    }
});
//# sourceMappingURL=search.js.map