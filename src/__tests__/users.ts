import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { User } from "../models/user";
import { Team } from "../models/teams";
import { Fixture } from "../models/fixtures";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";
import seed from "../db";

let token: string;
let adminToken: string;
let teamA: any;
let teamB: any;
let fixturesId: string;
let fixtureLink: string;
let session: object;

beforeAll(async () => {
  await User.deleteMany({});

  const user = await request(app)
    .post("/api/v1/users/signup")
    .send({
      name: "Wilson",
      email: "wilson@gmail.com",
      password: "pass123456"
    });
  token = user.body.data.token;
  await seed();

  teamA = await Team.findOne({ name: "Brimingham City" });
  teamB = await Team.findOne({ name: "Fulham" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("SignUp Routes", () => {
  it("user should sign up", () => {
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
const mockedAuth = auth as jest.Mocked<any>;
mockedAuth.mockImplementation(
  async (req: Request, res: Response, next: NextFunction) => {
    //supertest sees req.session as undefined so had to mock it

    //session store
    session = {};
    try {
      const payload = req.headers.authorization.split(" ")[1];

      if (!payload)
        return res.status(401).send({
          data: { message: "access denied no token provided" }
        });

      const decoded: any = jwt.verify(payload, config.get("jwtPrivateKey"));

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
      } else {
        res.status(401).send({ data: { message: "user does not exist" } });
      }
    } catch (error) {
      res.status(400).send({ data: { error } });
    }
  }
);

describe("Fixtures Routes", () => {
  it("UnAuthenticated users should not see fixtures", () => {
    return request(app)
      .get("/api/v1/fixtures")
      .set("Authorization", `Bearer ${"aaa"}`)
      .expect(res => {
        expect(res.body.data.error.message).toBe("jwt malformed");
      });
  });
  it("Authenticated users should see fixtures", () => {
    return request(app)
      .get("/api/v1/fixtures")
      .set("Authorization", `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data.message).toHaveLength(12);
      });
  });
  it("UnAuthorized Users should not see fixtures", () => {
    return request(app)
      .get("/api/v1/fixtures")
      .expect("Content-Type", /json/)
      .set("Authorization", `abcd`)
      .expect(res => {
        expect(res.body.data.message).toBe("access denied no token provided");
      });
  });
  it("Users should see completed fixtures", () => {
    return request(app)
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
    return request(app)
      .get("/api/v1/fixtures/pend")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
  it("Admin should create fixtures", () => {
    return request(app)
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
    return request(app)
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
    return request(app)
      .put(`/api/v1/fixtures/${fixturesId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        homeScore: 4,
        awayScore: 2,
        played: true
      })
      .expect(res => {
        expect(res.body.data.message).toBe(
          `Fixture ${fixturesId} updated successfully`
        );
      });
  });

  it("Admin should delete fixtures", () => {
    return request(app)
      .delete(`/api/v1/fixtures/${fixturesId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(res => {
        expect(res.body.data.message).toBe(
          `Fixture ${fixturesId} deleted successfully`
        );
      });
  });
});

describe("Team Routes", () => {
  it("Users should view teams", () => {
    return request(app)
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
    return request(app)
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
        expect(res.body.data.message).toBe(
          `Team Forest Green created succesfully`
        );
      });
  });

  it("User should not create teams", () => {
    return request(app)
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
    return request(app)
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
        expect(res.body.data.message).toBe(
          `Team Brimingham City is updated succesfully`
        );
      });
  });

  it("Users should not update teams", () => {
    return request(app)
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
    return request(app)
      .delete(`/api/v1/teams/${teamA._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(res => {
        expect(res.body.data.message).toBe(
          `Team Brimingham City is deleted succesfully`
        );
      });
  });
});

describe("Public Routes", () => {
  it("All user can search team robustly (eg using coach name)", () => {
    return request(app)
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
    return request(app)
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
    return request(app)
      .get(`/api/v1/search/team/${"1980"}`)
      .expect(res => {
        expect(res.body.data.message[0]).toHaveProperty("name");
        expect(res.body.data.message[0]).toHaveProperty("coach");
        expect(res.body.data.message[0]).toHaveProperty("country");
        expect(res.body.data.message[0]).toHaveProperty("wins");
      });
  });

  it("All user can search fixtures robustly using team name", () => {
    return request(app)
      .get(`/api/v1/search/fixtures/${"Chelsea"}`)
      .expect(res => {
        expect(res.body.data.message[0]).toHaveProperty("homeScore");
        expect(res.body.data.message[0]).toHaveProperty("awayScore");
        expect(res.body.data.message[0]).toHaveProperty("time");
        expect(res.body.data.message[0]).toHaveProperty("link");
      });
  });

  it("returns invalid input if user input id not valid", () => {
    return request(app)
      .get(`/api/v1/search/fixtures/${"Rangers"}`)
      .expect(res => {
        expect(res.body.data.message).toBe("Invalid Input");
      });
  });
});
