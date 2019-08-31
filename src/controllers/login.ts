import { User } from "../models/user";
import bcrypt from "bcrypt";
import { Response, Request } from "express";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (!checkUser) return res.status(404).send({ message: "email not found" });

  const matchPassword = await bcrypt.compare(password, checkUser.password);
  if (!matchPassword)
    return res.status(404).send({ message: "invalid password" });

  // remeber you need to send a token in the request header
  return res.status(200).send({ message: `welcome ${checkUser.name}` });
};
