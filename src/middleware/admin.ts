import { Request, Response, NextFunction } from "express";

function admin(req: Request, res: Response, next: NextFunction) {
  console.log(req["user"].isAdmin);
  if (!req["checkUser"].isAdmin) return res.status(403).send("Access denied");

  next();
}

export default admin;
