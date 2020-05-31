import * as Sentry from "@sentry/node";
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import * as Yup from "yup";
import { User } from "../../../types";
import getSchema from "../config/yup";
import { createUser } from "../middleware/authMiddleware";
import { UserDBRef } from "../utils/firebaseContants";

export const router = Router();

/**
 * Types
 */
type SignUpReq = Request<{}, null, Pick<User, "name" | "email" | "password">>;
type SignUpRes = Response<{ email?: string; message?: string }>;

/**
 * Handler
 */
router.post(
  "/signUp",
  async (req: SignUpReq, res: SignUpRes): Promise<SignUpRes | void> => {
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
        return res.status(200).send({ message: "Registration Successful!" });
      });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(400).send({ message: "Something went wrong!" });
    }
  }
);

/**
 * Types
 */
type SignInReq = Request<{}, null, Pick<User, "email" | "password">>;

/**
 * Handler
 */
router.post(
  "/signIn",
  async (req: SignInReq, res: Response<string>, next: NextFunction): Promise<Response<string>> => {
    console.log("SignIn: ", req.body);

    return passport.authenticate("local", (error, user) => {
      if (error || !user) return res.status(400).send("Wrong email or password!");

      // CREATE SESSION
      return req.login(user, err => {
        if (err) return res.status(400).send(err);
        return res.status(200).send("Login Successful!");
      });
    })(req, res, next);
  }
);

/**
 * Handler
 */
router.get(
  "/signOut",
  (req: Request, res: Response<string>): Response<string> => {
    req.logOut();
    return res.status(200).send("Logged Out!");
  }
);

/**
 * OAuth Handlers
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: "email"
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

/**
 * Validation Schema
 */
const SignUpSchema = getSchema({
  name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Too Short!").max(255, "Too Long!").required("Required")
});
