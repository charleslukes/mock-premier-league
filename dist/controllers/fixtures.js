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
    const fixtures = yield fixtures_1.Fixture.find().populate("homeTeam awayTeam", "name coach link -_id");
    res.status(200).json({ data: { message: fixtures } });
});
exports.view_completed_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const completedFixtures = yield fixtures_1.Fixture.find({ played: true }).populate("homeTeam awayTeam", "name coach -_id");
    res.status(200).json({ data: { message: completedFixtures } });
});
exports.view_pending_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingFixtures = yield fixtures_1.Fixture.find({ played: false }).populate("homeTeam awayTeam", "name coach -_id");
    res.status(200).json({ data: { message: pendingFixtures } });
});
exports.create_fixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = fixture_validate_1.validateFixture(req.body);
    if (error)
        return res.status(400).json(error.details[0].message);
    const { homeTeam, awayTeam, homeScore, awayScore, time, stadium, played } = req.body;
    const home = yield teams_1.Team.findById(homeTeam);
    if (!home)
        return res.status(400).json(`home Team doesn't exits`);
    const away = yield teams_1.Team.findById(awayTeam);
    if (!away)
        return res.status(400).json(`away Team doesn't exits`);
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
        return res.status(200).json({ data: { message: fixture } });
    }
    catch (error) {
        return res.status(400).json({ Error: error.message });
    }
});
exports.update_fixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = fixture_validate_1.validateUpdateFixture(req.body);
    if (error)
        return res.status(400).json(error.details[0].message);
    const { homeScore, awayScore, played } = req.body;
    try {
        const { homeTeam, awayTeam, time, stadium, _id } = yield fixtures_1.Fixture.findById({
            _id: req.params.id
        });
        const updateFixture = yield fixtures_1.Fixture.findByIdAndUpdate(_id, {
            homeTeam,
            awayTeam,
            time,
            stadium,
            homeScore,
            awayScore,
            played
        });
        yield updateFixture.save();
        const home = yield teams_1.Team.findById(homeTeam);
        const away = yield teams_1.Team.findById(awayTeam);
        // update the wins and losses if played is true
        if (played) {
            if (homeScore > awayScore) {
                home.wins += 1;
                away.losses += 1;
                home.goals += homeScore;
                away.goals += awayScore;
            }
            else if (homeScore < awayScore) {
                home.losses += 1;
                away.wins += 1;
                away.goals += awayScore;
                home.goals += homeScore;
            }
            else {
                away.goals += awayScore;
                home.goals += homeScore;
            }
            yield home.save();
            yield away.save();
        }
        res.status(200).json({
            data: {
                message: `Fixture ${_id} updated successfully`,
                output: updateFixture
            }
        });
    }
    catch (error) {
        res.status(400).json(`update failed :()`);
    }
});
exports.delete_fixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteFixture = yield fixtures_1.Fixture.findByIdAndDelete({
            _id: req.params.id
        });
        res.status(200).json({
            data: {
                message: `Fixture ${deleteFixture._id} deleted successfully`,
                output: deleteFixture
            }
        });
    }
    catch (error) {
        res.status(400).json(`delete failed :()`);
    }
});
exports.getFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const fixture = yield fixtures_1.Fixture.findOne({
        link: `http://localhost:${process.env.PORT}/api/fixtures/${id}`
    })
        .populate("homeTeam awayTeam", "name coach -_id")
        .select("-_id");
    if (!fixture) {
        return res.status(400).json({ data: { message: "Link is not available" } });
    }
    res.status(200).json({ data: { message: fixture } });
});
//# sourceMappingURL=fixtures.js.map