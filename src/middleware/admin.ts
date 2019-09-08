import { Request, Response, NextFunction } from "express";

function admin(req: Request, res: Response, next: NextFunction) {
  if (!req["checkUser"].isAdmin)
    return res.status(403).send({ data: { message: "Forbidden" } });

  next();
}

export default admin;
