import { User } from "../models/user";
import { validateUser } from "../validator/user_validate";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send({ error: error.details[0].message });

  try {
    // find if the user already exits
    const { name, email } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ data: { message: `Email already in use` } });

    user = await new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const message = { name, email };
    const token = user.getAuthToken();

    //saves the users token to my redis store
    req.session[user._id] = { token, data: message };

    res.send({
      data: {
        output: "sign up successfully",
        message,
        token
      }
    });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      data: {
        output: "sign up failed",
        message
      }
    });
  }
};
