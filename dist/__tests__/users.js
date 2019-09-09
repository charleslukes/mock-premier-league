"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const user_1 = require("../models/user");
const teams_1 = require("../models/teams");
const auth_1 = __importDefault(require("../middleware/auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
let token;
let adminToken;
let teamA;
let teamB;
let fixturesId;
let fixtureLink;
let session;
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    yield user_1.User.deleteMany({});
    const user = yield supertest_1.default(app_1.default)
        .post("/api/v1/users/signup")
        .send({
        name: "Wilson",
        email: "wilson@gmail.com",
        password: "pass123456"
    });
    token = user.body.data.token;
    yield db_1.default();
    teamA = yield teams_1.Team.findOne({ name: "Brimingham City" });
    teamB = yield teams_1.Team.findOne({ name: "Fulham" });
}));
afterAll(() => __awaiter(this, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("SignUp Routes", () => {
    it("user should sign up", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/signup")
            .send({
            name: "Ojite Precious",
            email: "ojite@gmail.com",
            password: "pass123456"
        })
            .expect(res => {
            expect(Object.keys(res.body.data.message)).toContain("name");
            expect(Object.keys(res.body.data.message)).toContain("email");
        });
    });
    it("user should sign up", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/signup")
            .send({
            name: "Charles Precious",
            email: "charles@gmail.com",
            password: "pass123456"
        })
            .expect(res => {
            expect(Object.keys(res.body.data.message)).toContain("name");
            expect(Object.keys(res.body.data.message)).toContain("email");
        });
    });
    it("should return error if same user sign up again", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/signup")
            .send({
            name: "Ojite Precious",
            email: "ojite@gmail.com",
            password: "pass123456"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Email already in use`);
        });
    });
});
describe("Login Routes", () => {
    it("users should login", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/login")
            .send({
            email: "charles@gmail.com",
            password: "pass123456"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Welcome Charles Precious`);
        });
    });
    it("users should login", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/login")
            .send({
            email: "charles@gmail.c",
            password: "pass123456"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`email not found`);
        });
    });
    it("Admin should login", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/login")
            .send({
            email: "mark@example.com",
            password: "pass12345"
        })
            .expect(res => {
            adminToken = res.body.data.token;
            expect(res.body.data.message).toBe(`Welcome mark bash`);
        });
    });
    it("users should login", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/users/login")
            .send({
            email: "charles@gmail.com",
            password: "pass123"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`invalid password`);
        });
    });
});
//mocking the auth middleware
jest.mock("../middleware/auth");
const mockedAuth = auth_1.default;
mockedAuth.mockImplementation((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    //supertest sees req.session as undefined so had to mock it
    //session store
    session = {};
    try {
        const payload = req.headers.authorization.split(" ")[1];
        if (!payload)
            return res.status(401).send({
                data: { message: "access denied no token provided" }
            });
        const decoded = jsonwebtoken_1.default.verify(payload, process.env.JWT_PRIVATE_KEY);
        //say the user has already logged in / sign up
        session[decoded._id] = { token: payload };
        if (decoded) {
            //check the session store
            if (!session[decoded._id]) {
                return res.status(401).send({
                    data: { message: "Session over, Pls login..." }
                });
            }
            if (payload != session[decoded._id].token) {
                return res.status(401).send({
                    data: { message: "Invalid Token" }
                });
            }
            req["checkUser"] = decoded;
            next();
        }
        else {
            res.status(401).send({ data: { message: "user does not exist" } });
        }
    }
    catch (error) {
        res.status(400).send({ data: { error } });
    }
}));
describe("Fixtures Routes", () => {
    it("UnAuthenticated users should not see fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/v1/fixtures")
            .set("Authorization", `Bearer ${"aaa"}`)
            .expect(res => {
            expect(res.body.data.error.message).toBe("jwt malformed");
        });
    });
    it("Authenticated users should see fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/v1/fixtures")
            .set("Authorization", `Bearer ${token}`)
            .expect(res => {
            expect(res.body.data.message).toHaveLength(12);
        });
    });
    it("UnAuthorized Users should not see fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/v1/fixtures")
            .expect("Content-Type", /json/)
            .set("Authorization", `abcd`)
            .expect(res => {
            expect(res.body.data.message).toBe("access denied no token provided");
        });
    });
    it("Users should see completed fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/v1/fixtures/complete")
            .set("Authorization", `Bearer ${token}`)
            .expect(res => {
            expect(res.body.data.message[0]).toHaveProperty("homeScore");
            expect(res.body.data.message[0]).toHaveProperty("awayScore");
            expect(res.body.data.message[0]).toHaveProperty("played");
            expect(res.body.data.message[0]).toHaveProperty("homeTeam");
            expect(res.body.data.message[0]).toHaveProperty("awayTeam");
            expect(res.body.data.message[0]).toHaveProperty("time");
            expect(res.body.data.message[0]).toHaveProperty("stadium");
        });
    });
    it("Users should see pending fixtures", () => {
        return supertest_1.default(app_1.default)
            .get("/api/v1/fixtures/pend")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });
    it("Admin should create fixtures", () => {
        return supertest_1.default(app_1.default)
            .post("/api/v1/fixtures")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            homeTeam: teamA._id,
            awayTeam: teamB._id,
            time: "7:00pm",
            homeScore: 0,
            awayScore: 0,
            stadium: "boltonfield",
            played: false
        })
            .expect(res => {
            //assign fixtures properties
            fixturesId = res.body.data.message._id;
            fixtureLink = res.body.data.message.link;
            expect(res.body.data.message).toMatchObject({
                homeScore: 0,
                awayScore: 0,
                stadium: "boltonfield",
                played: false
            });
        });
    });
    it("Users should see a fixtures by link", () => {
        let link = fixtureLink.split("/");
        let mainLink = link[link.length - 1];
        return supertest_1.default(app_1.default)
            .get(`/api/v1/fixtures/${mainLink}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(res => {
            expect(res.body.data.message).toMatchObject({
                homeScore: 0,
                awayScore: 0,
                stadium: "boltonfield",
                homeTeam: { name: "Brimingham City", coach: "ochuko" },
                awayTeam: { name: "Fulham", coach: "Van gwart" },
                time: "7:00pm",
                played: false
            });
        });
    });
    it("Admin should update fixtures", () => {
        return supertest_1.default(app_1.default)
            .put(`/api/v1/fixtures/${fixturesId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            homeScore: 4,
            awayScore: 2,
            played: true
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Fixture ${fixturesId} updated successfully`);
        });
    });
    it("Admin should delete fixtures", () => {
        return supertest_1.default(app_1.default)
            .delete(`/api/v1/fixtures/${fixturesId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(res => {
            expect(res.body.data.message).toBe(`Fixture ${fixturesId} deleted successfully`);
        });
    });
});
describe("Team Routes", () => {
    it("Users should view teams", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/teams`)
            .set("Authorization", `Bearer ${token}`)
            .expect(res => {
            expect(res.body.data.message[0]).toHaveProperty("wins");
            expect(res.body.data.message[0]).toHaveProperty("losses");
            expect(res.body.data.message[0]).toHaveProperty("name");
            expect(res.body.data.message[0]).toHaveProperty("email");
        });
    });
    it("Admin should create teams", () => {
        return supertest_1.default(app_1.default)
            .post(`/api/v1/teams`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            name: "Forest Green",
            email: "forestgreen@email.com",
            coach: "Omolayo",
            country: "England",
            founded: 2000,
            stadium_name: "forest field",
            wins: 2,
            losses: 17,
            goals: 8,
            stadium_capacity: "60000m"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Team Forest Green created succesfully`);
        });
    });
    it("User should not create teams", () => {
        return supertest_1.default(app_1.default)
            .post(`/api/v1/teams`)
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "Forest Green",
            email: "forestgreen@email.com",
            coach: "Omolayo",
            country: "England",
            founded: 2000,
            stadium_name: "forest field",
            wins: 2,
            losses: 17,
            goals: 8,
            stadium_capacity: "60000m"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Forbidden`);
        });
    });
    it("Admin should update teams", () => {
        return supertest_1.default(app_1.default)
            .put(`/api/v1/teams/${teamA._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            coach: "Abetang",
            country: "England",
            founded: 2000,
            stadium_name: "forest field",
            stadium_capacity: "60000m"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Team Brimingham City is updated succesfully`);
        });
    });
    it("Users should not update teams", () => {
        return supertest_1.default(app_1.default)
            .put(`/api/v1/teams/${teamA._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
            coach: "Abetang",
            country: "England",
            founded: 2000,
            stadium_name: "forest field",
            stadium_capacity: "60000m"
        })
            .expect(res => {
            expect(res.body.data.message).toBe(`Forbidden`);
        });
    });
    it("Admin should remove team", () => {
        return supertest_1.default(app_1.default)
            .delete(`/api/v1/teams/${teamA._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(res => {
            expect(res.body.data.message).toBe(`Team Brimingham City is deleted succesfully`);
        });
    });
});
describe("Public Routes", () => {
    it("All user can search team robustly (eg using coach name)", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/search/team/${"ochuko"}`)
            .expect(res => {
            expect(res.body.data.message[0]).toMatchObject({
                coach: "ochuko",
                country: "England",
                email: "norwich@email.com",
                founded: 1998,
                goals: 7,
                losses: 20,
                name: "Norwich City",
                stadium_capacity: "50000m",
                stadium_name: "camp nou",
                wins: 4
            });
        });
    });
    it("All user can search team robustly using team name", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/search/team/${"Bolton"}`)
            .expect(res => {
            expect(res.body.data.message[0]).toMatchObject({
                name: "Bolton",
                country: "England",
                email: "bolton@email.com",
                founded: 1980
            });
        });
    });
    it("All user can search team robustly using year founded", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/search/team/${"1980"}`)
            .expect(res => {
            expect(res.body.data.message[0]).toHaveProperty("name");
            expect(res.body.data.message[0]).toHaveProperty("coach");
            expect(res.body.data.message[0]).toHaveProperty("country");
            expect(res.body.data.message[0]).toHaveProperty("wins");
        });
    });
    it("All user can search fixtures robustly using team name", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/search/fixtures/${"Chelsea"}`)
            .expect(res => {
            expect(res.body.data.message[0]).toHaveProperty("homeScore");
            expect(res.body.data.message[0]).toHaveProperty("awayScore");
            expect(res.body.data.message[0]).toHaveProperty("time");
            expect(res.body.data.message[0]).toHaveProperty("link");
        });
    });
    it("returns invalid input if user input id not valid", () => {
        return supertest_1.default(app_1.default)
            .get(`/api/v1/search/fixtures/${"Rangers"}`)
            .expect(res => {
            expect(res.body.data.message).toBe("Invalid Input");
        });
    });
});
//# sourceMappingURL=users.js.map