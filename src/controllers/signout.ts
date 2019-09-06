import { Request, Response } from "express";

export const signout = async (req: Request, res: Response) => {
  req.session.key = false;

  return res.status(200).send({
    data: {
      message: "signed out successfully"
    }
  });
};
