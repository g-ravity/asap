import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { NextFunction, Request, Response } from "express";
import { Id, User } from "../../../types";
import { UserDBRef, UserDocRef } from "../utils/firebaseContants";

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  console.log("User: ", req.user);
  console.log("Request Body: ", req.body);

  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("Not Authorized!");
  }
};

export const createUser = async (params: Omit<User, "projectIds" | "createdAt">): Promise<User & Id> => {
  try {
    const { password, facebookId, googleId, email } = params;

    const userDocs = await UserDBRef().where("email", "==", email).get();

    const user: User = {
      ...params,
      projectIds: [],
      createdAt: new Date()
    };

    if (password) {
      const salt = randomBytes(32);
      user.password = await argon2.hash(password, { salt });
    }

    if (!userDocs.empty) {
      if (googleId) await UserDocRef(userDocs.docs[0].id).update({ googleId } as Partial<User>);
      if (facebookId) await UserDocRef(userDocs.docs[0].id).update({ facebookId } as Partial<User>);
      if (password) {
        await UserDocRef(userDocs.docs[0].id).update({
          password: user.password
        } as Partial<User>);
      }

      return { id: userDocs.docs[0].id, ...user };
    }

    console.log("User to be Registered: ", user);

    const userDocRef = await UserDBRef().add(user);
    return { id: userDocRef.id, ...user };
  } catch (err) {
    throw new Error(err);
  }
};
