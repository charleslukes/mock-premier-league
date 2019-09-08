import { Fixture } from "../models/fixtures";
import { Team } from "../models/teams";

import { Request, Response } from "express";

export const searchTeam = async (req: Request, res: Response) => {
  const { id } = req.params;

  let value: RegExp;
  try {
    if (+id) {
      const team = await Team.find({ founded: id });
      if (team.length > 0)
        return res.status(200).json({ data: { message: team } });

      if (!!team) {
        return res.status(400).json(`Invalid Input`);
      }
    } else {
      value = new RegExp(id, "gi");

      const team = await Team.find().or([
        { name: { $regex: value } },
        { coach: { $regex: value } },
        { stadium_name: { $regex: value } }
      ]);

      if (team.length > 0)
        return res.status(200).json({ data: { message: team } });

      if (!!team) {
        return res.status(400).json({ data: { message: `Invalid Input` } });
      }
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const searchFixture = async (req: Request, res: Response) => {
  const { id } = req.params;

  let value = new RegExp(id, "gi");

  try {
    const fixtures = await Fixture.find().populate(
      "homeTeam awayTeam ",
      "name coach link -_id"
    );

    const getFixtures = fixtures.filter(elem => {
      if (
        value.test(elem.homeTeam["name"]) ||
        value.test(elem.awayTeam["name"])
      ) {
        return elem;
      }
    });
    if (getFixtures.length > 0)
      return res.status(200).json({ data: { message: getFixtures } });

    if (!!getFixtures) {
      return res.status(400).json({ data: { message: `Invalid Input` } });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
