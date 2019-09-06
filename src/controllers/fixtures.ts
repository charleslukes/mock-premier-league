import { Fixture } from "../models/fixtures";
import { Team } from "../models/teams";
import { validateFixture } from "../validator/fixture_validate";

import { Request, Response } from "express";

export const view_fixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixture.find().populate(
    "homeTeam awayTeam",
    "name coach link -_id"
  );

  res.status(200).send(fixtures);
};

export const view_completed_fixtures = async (req: Request, res: Response) => {
  const completedFixtures = await Fixture.find({ played: true }).populate(
    "homeTeam awayTeam",
    "name coach -_id"
  );

  res.status(200).json(completedFixtures);
};

export const view_pending_fixtures = async (req: Request, res: Response) => {
  const pendingFixtures = await Fixture.find({ played: false }).populate(
    "homeTeam awayTeam",
    "name coach -_id"
  );

  res.status(200).json(pendingFixtures);
};

export const create_fixtures = async (req: Request, res: Response) => {
  console.log(req.body);
  const { error } = validateFixture(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    time,
    stadium,
    played
  } = req.body;
  const home = await Team.findById(homeTeam);
  if (!home) return res.status(400).send(`home Team doesn't exits`);

  const away = await Team.findById(awayTeam);
  if (!away) return res.status(400).send(`away Team doesn't exits`);

  try {
    const fixture = await new Fixture({
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      time,
      stadium,
      played
    });

    await fixture.save();
    return res.status(200).send(fixture);
  } catch (error) {
    return res.status(400).send({ Error: error.message });
  }
};

export const update_fixture = async (req: Request, res: Response) => {
  const { error } = validateFixture(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { homeTeam, awayTeam, homeScore, awayScore, played } = req.body;
  try {
    const updateTeam = await Fixture.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    const home = await Team.findById(homeTeam);
    const away = await Team.findById(awayTeam);

    // update the wins and losses if played is true
    if (played) {
      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.goals += homeScore;
        away.goals += homeScore;
      } else if (homeScore < awayScore) {
        home.losses += 1;
        away.wins += 1;
        away.goals += homeScore;
        home.goals += homeScore;
      } else {
        away.goals += homeScore;
        home.goals += homeScore;
      }

      await home.save();
      await away.save();
    }

    res.status(200).send(`Fixture ${updateTeam._id} is updated succesfully`);
  } catch (error) {
    res.status(400).send(`update failed :()`);
  }
};

export const delete_fixture = async (req: Request, res: Response) => {
  try {
    const deleteTeam = await Fixture.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send(`Fixture ${deleteTeam._id} is deleted succesfully`);
  } catch (error) {
    res.status(400).send(`delete failed :()`);
  }
};

export const getFixture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fixture = await Fixture.findOne({
    link: `http://localhost:${process.env.PORT}/api/fixtures/${id}`
  })
    .populate("homeTeam awayTeam", "name coach -_id")
    .select("-_id");

  if (!fixture) {
    return res.status(400).send({ data: { message: "Link is not available" } });
  }

  res.status(200).send(fixture);
};
