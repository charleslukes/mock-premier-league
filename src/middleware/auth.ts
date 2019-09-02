import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";
function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("access denied no token provided");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req["checkUser"] = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;
