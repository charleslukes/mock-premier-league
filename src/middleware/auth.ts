import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.headers.authorization.split(" ")[1];
    console.log("heyyyy", payload);
    if (!payload)
      return res
        .status(401)
        .send({ data: { message: "access denied no token provided" } });
    const decoded: any = jwt.verify(payload, config.get("jwtPrivateKey"));
    const user = await User.findById(decoded._id);
    if (user) {
      req["checkUser"] = user;
      next();
    } else {
      res.status(401).send({ data: { message: "user does not exist" } });
    }
  } catch (error) {
    res.status(400).send(error);
  }
}
export default auth;
