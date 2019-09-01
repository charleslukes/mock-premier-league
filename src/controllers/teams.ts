import { Team } from "../models/teams";
import { validateTeam } from "../validator/team_validate";
import { Request, Response } from "express";

export const view_teams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.send(teams);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const create_teams = async (req: Request, res: Response) => {
  // since only the admin can create team I need to get the token of the user
  // but do this in a middleware and place it in your routes

  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    email,
    coach,
    country,
    founded,
    stadium_name,
    stadium_capacity
  } = req.body;

  const checkTeam = await Team.findOne({ email });
  if (checkTeam)
    return res.status(404).send({ message: `Email already in use` });

  const newTeam = await new Team({
    name,
    email,
    coach,
    country,
    founded,
    stadium_name,
    stadium_capacity
  });

  await newTeam.save();

  res.send({ message: `Team ${name} created succesfully` });
};

export const update_team = async (req: Request, res: Response) => {
  try {
    const updateTeam = await Team.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(`Team ${updateTeam.name} is updated succesfully`);
  } catch (error) {
    res.status(400).send(`update failed :()`);
  }
};
