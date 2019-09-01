import { Fixture } from "../models/fixtures";
import { Request, Response } from "express";

export const view_fixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixture.find();

  res.send(fixtures);
};

export const create_fixtures = async (req: Request, res: Response) => {};
