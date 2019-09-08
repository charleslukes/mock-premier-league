import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.headers.authorization.split(" ")[1];
    if (!payload)
      return res.status(401).send({
        data: { message: "access denied no token provided" }
      });

    const decoded: any = jwt.verify(payload, config.get("jwtPrivateKey"));
    const user = await User.findById(decoded._id);
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
