import { User } from "../models/user";
import bcrypt from "bcrypt";
import { Response, Request } from "express";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (!checkUser)
    return res.status(404).send({ data: { message: "email not found" } });

  const matchPassword = await bcrypt.compare(password, checkUser.password);
  if (!matchPassword)
    return res.status(404).send({ data: { message: "invalid password" } });

  // remeber you need to send a token in the request header
  const token = checkUser.getAuthToken();

  //save their session token when they login
  req.session.key = { token, data: checkUser };

  return res
    .status(200)
    .send({ data: { message: `Welcome ${checkUser.name}`, token } });
};
