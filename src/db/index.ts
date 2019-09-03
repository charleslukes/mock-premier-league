import teams from "./data/teams";
import fixtures from "./data/fixtures";
import { Team } from "../models/teams";
import { Fixture } from "../models/fixtures";

const cleanDb = async () => {
  try {
    console.log("succesfully cleared db");
    return await Team.deleteMany({});
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

const seed = () => {
  cleanDb()
    .then(async () => {
      await seedTeam();
      await seedFixture();
    })
    .then(() => console.log(`Database has been seeded`))
    .catch(err => {
      console.log({ err });
    });
};

export default seed;
