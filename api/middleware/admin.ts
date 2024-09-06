import { Request, Response } from "express";

export const AuthAdmin = (req: Request, res: Response) => {
  const user = req.body;
  if (!user.isAdmin) {
    return res.status(401).send("Unauthorized");
  }
};
