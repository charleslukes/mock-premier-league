import { User } from "../models/user";
import { validateUser } from "../validator/user_validate";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send({ error: error.details[0].message });

  try {
    // finc if the user already exits
    console.log(req.body);
    const { name, email } = req.body;

    const user = await new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
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
