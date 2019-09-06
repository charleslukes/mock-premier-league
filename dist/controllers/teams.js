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
const teams_1 = require("../models/teams");
const team_validate_1 = require("../validator/team_validate");
exports.view_teams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield teams_1.Team.find().sort({ name: 1 });
        res.send(teams);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
exports.create_teams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // since only the admin can create team I need to get the token of the user
    // but do this in a middleware and place it in your routes
    const { error } = team_validate_1.validateTeam(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { name, email, coach, country, founded, stadium_name, stadium_capacity } = req.body;
    const checkTeam = yield teams_1.Team.findOne({ email });
    if (checkTeam)
        return res.status(404).send({ message: `Email already in use` });
    const newTeam = yield new teams_1.Team({
        name: name.toLowerCase(),
        email,
        coach,
        country,
        founded,
        stadium_name,
        stadium_capacity
    });
    yield newTeam.save();
    res.send({ message: `Team ${name} created succesfully` });
});
exports.update_team = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateTeam = yield teams_1.Team.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).send(`Team ${updateTeam.name} is updated succesfully`);
    }
    catch (error) {
        res.status(400).send(`update failed :()`);
    }
});
exports.delete_team = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteTeam = yield teams_1.Team.findByIdAndDelete({ _id: req.params.id });
        res.status(200).send(`Team ${deleteTeam.name} is deleted succesfully`);
    }
    catch (error) {
        res.status(400).send(`delete failed :()`);
    }
});
//# sourceMappingURL=teams.js.map