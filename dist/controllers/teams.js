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
exports.view_teams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield teams_1.Team.find().sort({ name: 1 });
        res.send(teams);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
//# sourceMappingURL=teams.js.map