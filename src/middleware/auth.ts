import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.headers.authorization.split(" ")[1];
    if (!payload)
      return res.status(401).send({
        data: { message: "access denied no token provided" }
      });

    const decoded: any = jwt.verify(payload, process.env.JWT_PRIVATE_KEY);
    const user = await User.findById(decoded._id);
    console.log(user);

    if (user) {
      //check the session store
      console.log({ session: req.session });
      if (!req.session[user._id]) {
        return res.status(401).send({
          data: { message: "Session over, Pls login..." }
        });
      }

      if (payload != req.session[user._id].token) {
        return res.status(401).send({
          data: { message: "Invalid Token" }
        });
      }

      req["checkUser"] = user;
      next();
    } else {
      res.status(401).send({ data: { message: "user does not exist" } });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ data: { error } });
  }
}
export default auth;
