import { Fixture } from "../models/fixtures";
import { Team } from "../models/teams";
import {
  validateFixture,
  validateUpdateFixture
} from "../validator/fixture_validate";

import { Request, Response } from "express";
import fixtures = require("../db/seed/fixtures");

export const view_fixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixture.find().populate(
    "homeTeam awayTeam",
    "name coach link -_id"
  );

  res.status(200).json({ data: { message: fixtures } });
};

export const view_completed_fixtures = async (req: Request, res: Response) => {
  const completedFixtures = await Fixture.find({ played: true }).populate(
    "homeTeam awayTeam",
    "name coach -_id"
  );

  res.status(200).json({ data: { message: completedFixtures } });
};

export const view_pending_fixtures = async (req: Request, res: Response) => {
  const pendingFixtures = await Fixture.find({ played: false }).populate(
    "homeTeam awayTeam",
    "name coach -_id"
  );

  res.status(200).json({ data: { message: pendingFixtures } });
};

export const create_fixtures = async (req: Request, res: Response) => {
  const { error } = validateFixture(req.body);

  if (error) return res.status(400).json(error.details[0].message);

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
  if (!home) return res.status(400).json(`home Team doesn't exits`);

  const away = await Team.findById(awayTeam);
  if (!away) return res.status(400).json(`away Team doesn't exits`);

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
    return res.status(200).json({ data: { message: fixture } });
  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }
};

export const update_fixture = async (req: Request, res: Response) => {
  const { error } = validateUpdateFixture(req.body);

  if (error) return res.status(400).json(error.details[0].message);

  const { homeScore, awayScore, played } = req.body;
  try {
    const { homeTeam, awayTeam, time, stadium, _id } = await Fixture.findById({
      _id: req.params.id
    });
    const updateFixture = await Fixture.findByIdAndUpdate(_id, {
      homeTeam,
      awayTeam,
      time,
      stadium,
      homeScore,
      awayScore,
      played
    });

    await updateFixture.save();

    const home = await Team.findById(homeTeam);
    const away = await Team.findById(awayTeam);

    // update the wins and losses if played is true
    if (played) {
      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.goals += homeScore;
        away.goals += awayScore;
      } else if (homeScore < awayScore) {
        home.losses += 1;
        away.wins += 1;
        away.goals += awayScore;
        home.goals += homeScore;
      } else {
        away.goals += awayScore;
        home.goals += homeScore;
      }

      await home.save();
      await away.save();
    }

    res.status(200).json({
      data: {
        message: `Fixture ${_id} updated successfully`,
        output: updateFixture
      }
    });
  } catch (error) {
    res.status(400).json(`update failed :()`);
  }
};

export const delete_fixture = async (req: Request, res: Response) => {
  try {
    const deleteFixture = await Fixture.findByIdAndDelete({
      _id: req.params.id
    });
    res.status(200).json({
      data: {
        message: `Fixture ${deleteFixture._id} deleted successfully`,
        output: deleteFixture
      }
    });
  } catch (error) {
    res.status(400).json(`delete failed :()`);
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
    return res.status(400).json({ data: { message: "Link is not available" } });
  }

  res.status(200).json({ data: { message: fixture } });
};
