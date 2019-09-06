import { Fixture } from "../models/fixtures";
import { Team } from "../models/teams";

import { Request, Response } from "express";

export const searchTeam = async (req: Request, res: Response) => {
  const { id } = req.params;

  let value: RegExp;
  let num: string;

  if (+id) {
    num = id;
  } else {
    value = new RegExp(id, "gi");
  }

  try {
    const team = await Team.find().or([
      { name: { $regex: value } },
      { coach: { $regex: value } },
      { stadium_name: { $regex: value } },
      { founded: num }
    ]);

    if (team) return res.status(200).send({ data: { message: team } });

    if (!team) {
      return res.status(400).send(`Invalid Input`);
    }
  } catch (error) {
    return res.status(400).send({ error });
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

    if (fixtures)
      return res.status(200).send({ data: { message: getFixtures } });

    if (!fixtures) {
      return res.status(400).send(`Invalid Input`);
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
};
