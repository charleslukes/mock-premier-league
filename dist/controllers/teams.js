"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const teams_1 = require("../models/teams");
const team_validate_1 = require("../validator/team_validate");
exports.view_teams = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const teams = yield teams_1.Team.find({ isDeleted: false })
            .sort({ name: 1 })
            .select({
            isDeleted: 0
        });
        res.status(200).json({ data: { message: teams } });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.create_teams = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { error } = team_validate_1.validateTeam(req.body);
    if (error)
        return res.status(400).json(error.details[0].message);
    try {
        const { name, email, coach, country, founded, stadium_name, stadium_capacity } = req.body;
        const checkTeam = yield teams_1.Team.findOne({ email });
        if (checkTeam)
            return res.status(404).json({ message: `Email already in use` });
        const newTeam = yield new teams_1.Team({
            name,
            email,
            coach,
            country,
            founded,
            stadium_name,
            stadium_capacity
        });
        yield newTeam.save();
        res.json({ data: { message: `Team ${name} created succesfully` } });
    }
    catch (error) {
        res.status(400).json({ data: { message: error.message } });
    }
});
exports.update_team = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const updateTeam = yield teams_1.Team.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).json({
            data: { message: `Team ${updateTeam.name} is updated succesfully` }
        });
    }
    catch (error) {
        res.status(400).json({ data: { message: `update failed :()`, error } });
    }
});
exports.delete_team = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const deleteTeam = yield teams_1.Team.findById({ _id: req.params.id });
        deleteTeam.isDeleted = true;
        yield deleteTeam.save();
        res
            .status(200)
            .json({
            data: { message: `Team ${deleteTeam.name} is deleted succesfully` }
        });
    }
    catch (error) {
        res.status(400).json({ data: { message: `delete failed :()`, error } });
    }
});
//# sourceMappingURL=teams.js.map