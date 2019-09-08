import teams from "./seed/teams";
import fixtures from "./seed/fixtures";
import users from "./seed/users";
import { Team } from "../models/teams";
import { Fixture } from "../models/fixtures";
import { User } from "../models/user";
import bcrypt from "bcrypt";

const cleanDb = async () => {
  try {
    console.log("succesfully cleared db");
    await Team.deleteMany({});
    await Fixture.deleteMany({});
    await User.deleteMany({});
  } catch (err) {
    console.log("Error: occured", err);
    return err;
  }
};

const seedTeam = async () => {
  try {
    const allTeams = teams.map(async team => {
      const newTeam = await new Team(team);
      return newTeam.save();
    });
    const res = await Promise.all(allTeams);
    return res;
  } catch (err) {
    console.log({ err });
    return err;
  }
};

const seedUser = async () => {
  try {
    const allUser = users.map(async user => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await new User(user);
      return newUser.save();
    });
    const res = await Promise.all(allUser);
    return res;
  } catch (err) {
    console.log({ err });
    return err;
  }
};
const seedFixture = async () => {
  try {
    const allfixtures = fixtures.map(async fixture => {
      const hometeam = await Team.findOne({ name: fixture.homeTeam }).exec();
      const awayteam = await Team.findOne({ name: fixture.awayTeam }).exec();
      const newFixtures = await new Fixture({
        ...fixture,
        homeTeam: hometeam.id,
        awayTeam: awayteam.id
      });
      await newFixtures.save();
    });
    const res = await Promise.all(allfixtures);
    return res;
  } catch (err) {
    console.log({ err });
    return err;
  }
};

const seed = async () => {
  return await cleanDb()
    .then(async () => {
      await seedTeam();
      await seedUser();
      await seedFixture();
    })
    .then(() => console.log(`Database has been seeded`))
    .catch(err => {
      console.log({ err });
    });
};

export default seed;
