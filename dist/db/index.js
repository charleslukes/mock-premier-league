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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teams_1 = __importDefault(require("./seed/teams"));
const fixtures_1 = __importDefault(require("./seed/fixtures"));
const users_1 = __importDefault(require("./seed/users"));
const teams_2 = require("../models/teams");
const fixtures_2 = require("../models/fixtures");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cleanDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("succesfully cleared db");
        yield teams_2.Team.deleteMany({});
        yield fixtures_2.Fixture.deleteMany({});
        yield user_1.User.deleteMany({});
    }
    catch (err) {
        console.log("Error: occured", err);
        return err;
    }
});
const seedTeam = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTeams = teams_1.default.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            const newTeam = yield new teams_2.Team(team);
            return newTeam.save();
        }));
        const res = yield Promise.all(allTeams);
        return res;
    }
    catch (err) {
        console.log({ err });
        return err;
    }
});
const seedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = users_1.default.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
            const newUser = yield new user_1.User(user);
            return newUser.save();
        }));
        const res = yield Promise.all(allUser);
        return res;
    }
    catch (err) {
        console.log({ err });
        return err;
    }
});
const seedFixture = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allfixtures = fixtures_1.default.map((fixture) => __awaiter(void 0, void 0, void 0, function* () {
            const hometeam = yield teams_2.Team.findOne({ name: fixture.homeTeam }).exec();
            const awayteam = yield teams_2.Team.findOne({ name: fixture.awayTeam }).exec();
            const newFixtures = yield new fixtures_2.Fixture(Object.assign(Object.assign({}, fixture), { homeTeam: hometeam.id, awayTeam: awayteam.id }));
            yield newFixtures.save();
        }));
        const res = yield Promise.all(allfixtures);
        return res;
    }
    catch (err) {
        console.log({ err });
        return err;
    }
});
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield cleanDb()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield seedTeam();
        yield seedUser();
        yield seedFixture();
    }))
        .then(() => console.log(`Database has been seeded`))
        .catch(err => {
        console.log({ err });
    });
});
exports.default = seed;
//# sourceMappingURL=index.js.map