import { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as Yup from "yup";
import * as Sentry from "@sentry/node";
import { User } from "../../../../types";
import getSchema from "../../config/yup";
import { UserDBRef, UserDocRef } from "../../utils/firebaseContants";
import createUser from "./createUser";

/**
 * Types
 */
type SignUpReq = Request<{}, null, Pick<User, "name" | "email" | "password">>;
type SignUpRes = Response<{ email?: string; message?: string }>;

type SignInReq = Request<{}, null, Pick<User, "email" | "password">>;

/**
 * Controllers
 */
export const fetchUser = async (req: Request<{}, null, null>, res: Response): Promise<Response<User>> => {
  try {
    const { id } = req.user!;

    const userDoc = await UserDocRef(id).get();
    if (!userDoc.exists) throw new Error();

    const user = userDoc.data() as User;
    return res.send(user);
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send({ message: "Something Went Wrong!" });
  }
};

export const signUp = async (req: SignUpReq, res: SignUpRes): Promise<SignUpRes | void> => {
  console.log("SignUp: ", req.body);

  try {
    await SignUpSchema.validate(req.body);

    const { email } = req.body;
    const userDocs = await UserDBRef().where("email", "==", email).get();

    if (!userDocs.empty && userDocs.docs[0].get("password"))
      return res.status(400).send({ email: "Email already registered" });

    const user = await createUser(req.body);

    // CREATE SESSION
    return req.login(user, err => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(user);
    });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send({ message: "Something Went Wrong!" });
  }
};

interface SignInRes {
  email: string;
  password: string;
}

export const signIn = async (
  req: SignInReq,
  res: Response<SignInRes | User>,
  next: NextFunction
): Promise<Response<SignInRes | User>> => {
  console.log("SignIn: ", req.body);

  return passport.authenticate("local", (error, user) => {
    if (error || !user) return res.status(400).send({ email: " ", password: "Wrong email or password!" });

    // CREATE SESSION
    return req.login(user, err => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(user);
    });
  })(req, res, next);
};

export const signOut = (req: Request, res: Response<string>): Response<string> => {
  req.logOut();
  return res.status(200).send("Logged Out!");
};

// OAUTH CONTROLLERS
export const googleOAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});

export const googleOAuthCallback = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/"
});

export const facebookOAuth = passport.authenticate("facebook", {
  scope: "email"
});

export const facebookOAuthCallback = passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/"
});

/**
 * Validation Schema
 */
const SignUpSchema = getSchema({
  name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Too Short!").max(255, "Too Long!").required("Required")
});
