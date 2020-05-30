import { Request, Response, NextFunction } from "express";
import passport from "passport";
import * as Yup from "yup";
import { getUserDBRef } from "../../utils/firebaseContants";
import { db } from "../../config/firebase";
import { User } from "../../../../types";
import createUser from "./createUser";

/**
 * Sign Up
 */
type SignUpReq = Request<{}, null, Pick<User, "name" | "email" | "password">>;
type SignUpRes = Response<{}>;

export const signUp = async (req: SignUpReq, res: SignUpRes): Promise<SignUpRes> => {
  try {
    await SignUpSchema.validate(req.body);

    const { email } = req.body;
    const userDocs = await db.collection(getUserDBRef()).where("email", "==", email).get();
    if (!userDocs.empty) return res.status(400).send({ email: "Email already registered" });

    const user = await createUser(req.body);
    // CREATE SESSION
    req.login(user, err => res.status(400).send(err));
    return res.send({ auth: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Something went wrong!" });
  }
};

/**
 * Sign In
 */
type SignInReq = Request<{}, null, Pick<User, "email" | "password">>;
type SignInRes = Response<{}>;

export const signIn = async (req: SignInReq, res: SignInRes, next: NextFunction): Promise<SignInRes> => {
  return passport.authenticate("local", (error, user) => {
    if (error) return res.status(400).send({ message: "Wrong email or password!" });
    if (!user) return res.status(400).send({ message: "Wrong email or password!" });

    // CREATE SESSION
    req.login(user, err => res.status(400).send(err));
    return res.send({ auth: true });
  })(req, res, next);
};

/**
 * Sign Out
 */
export const signOut = (req: Request, res: Response): void => {
  req.logOut();
  res.send({});
};

/**
 * OAuth controllers...
 */

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
 * Auth Schema
 */

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Too Short!").max(255, "Too Long!").required("Required")
});
