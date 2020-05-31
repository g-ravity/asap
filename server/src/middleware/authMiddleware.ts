import { NextFunction, Request, Response } from "express";

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  console.log("User: ", req.user);
  console.log("Request Body: ", req.body);

  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("Not Authorized!");
  }
};
