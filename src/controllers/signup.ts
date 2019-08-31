import { User } from "../models/user";
import { validateUser } from "../validator/user_validate";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send({ error: error.details[0].message });

  try {
    const { name, email } = req.body;
    const user = await new User(req.body);
    await user.save();
    const data = { name, email };
    return res.status(200).send({
      output: "sign up successfully",
      data
    });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      output: "sign up failed",
      message
    });
  }
};
