import { Fixture } from "../models/fixtures";
import { Team } from "../models/teams";
import { validateFixture } from "../validator/fixture_validate";
import { Request, Response } from "express";

export const view_fixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixture.find();

  res.send(fixtures);
};

export const create_fixtures = async (req: Request, res: Response) => {
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
  const home = await Team.findById(homeTeam).select({ name: 1, coach: 1 });
  if (!home) return res.status(400).send(`home Team doesn't exits`);

  const away = await Team.findById(awayTeam).select({ name: 1, coach: 1 });
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
  try {
    const updateTeam = await Fixture.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
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

export const getFixture = (req: Request, res: Response) => {
  const { id } = req.query;
  const fixture = Fixture.findById({ id }).exec;
  res.send(fixture);
};
