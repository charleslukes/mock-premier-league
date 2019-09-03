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
const fixture_validate_1 = require("../validator/fixture_validate");
exports.view_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fixtures = yield fixtures_1.Fixture.find().populate("homeTeam awayTeam", "name coach -_id");
    res.status(200).send(fixtures);
});
exports.view_completed_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const completedFixtures = yield fixtures_1.Fixture.find({ played: true }).populate("homeTeam awayTeam", "name coach -_id");
    res.status(200).send(completedFixtures);
});
exports.view_pending_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingFixtures = yield fixtures_1.Fixture.find({ played: false }).populate("homeTeam awayTeam", "name coach -_id");
    res.status(200).send(pendingFixtures);
});
exports.create_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = fixture_validate_1.validateFixture(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { homeTeam, awayTeam, homeScore, awayScore, time, stadium, played } = req.body;
    const home = yield teams_1.Team.findById(homeTeam).select({ name: 1, coach: 1 });
    if (!home)
        return res.status(400).send(`home Team doesn't exits`);
    const away = yield teams_1.Team.findById(awayTeam).select({ name: 1, coach: 1 });
    if (!away)
        return res.status(400).send(`away Team doesn't exits`);
    try {
        const fixture = yield new fixtures_1.Fixture({
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            time,
            stadium,
            played
        });
        yield fixture.save();
        return res.status(200).send(fixture);
    }
    catch (error) {
        return res.status(400).send({ Error: error.message });
    }
});
exports.update_fixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateTeam = yield fixtures_1.Fixture.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).send(`Fixture ${updateTeam._id} is updated succesfully`);
    }
    catch (error) {
        res.status(400).send(`update failed :()`);
    }
});
exports.delete_fixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteTeam = yield fixtures_1.Fixture.findByIdAndDelete({ _id: req.params.id });
        res.status(200).send(`Fixture ${deleteTeam._id} is deleted succesfully`);
    }
    catch (error) {
        res.status(400).send(`delete failed :()`);
    }
});
// I have not touched this yet
exports.getFixture = (req, res) => {
    const { id } = req.query;
    const fixture = fixtures_1.Fixture.findById({ id }).exec;
    res.send(fixture);
};
//# sourceMappingURL=fixtures.js.map