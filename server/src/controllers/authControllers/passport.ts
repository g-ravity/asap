import * as Yup from "yup";
import passportGoogle from "passport-google-oauth20";
import passportFacebook from "passport-facebook";
import passportLocal from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs";
import { getUserDBRef } from "../../utils/firebaseContants";
import { User, Id } from "../../../../types";
import { db } from "../../config/firebase";
import createUser from "./createUser";
import keys from "../../config/keys";

passport.serializeUser((user: User & Id, done) => {
  console.log(user);
  done(null, { id: user.id, name: user.name });
});

passport.deserializeUser((user: Pick<User & Id, "id" | "name">, done) => {
  done(null, user);
});

passport.use(
  new passportLocal.Strategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        await SignInSchema.validate({ email, password });

        const userDocs = await db.collection(getUserDBRef()).where("email", "==", email).get();
        if (userDocs.empty) return done(null, false);

        const user: User & Id = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as User & Id))[0];

        const validPassword = await bcrypt.compare(password, user.password!);
        if (!validPassword) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(null, false, { message: "Email not registered." });
      }
    }
  )
);

passport.use(
  new passportGoogle.Strategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.gooogleClientSecret,
      callbackURL: `/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const userDocs = await db.collection(getUserDBRef()).where("googleID", "==", profile.id).get();

      if (!userDocs.empty) {
        const user: User = userDocs.docs.map(doc => doc.data() as User)[0];
        done(undefined, user);
      } else {
        const user = await createUser({
          name: profile.displayName,
          displayImage: profile.photos![0].value,
          email: profile.emails![0].value || "",
          googleId: profile.id
        });

        done(undefined, user);
      }
    }
  )
);

passport.use(
  new passportFacebook.Strategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: `/api/auth/facebook/callback`,
      profileFields: ["name", "emails", "picture.type(large)"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const userDocs = await db.collection(getUserDBRef()).where("googleID", "==", profile.id).get();

      if (!userDocs.empty) {
        const user: User = userDocs.docs.map(doc => doc.data() as User)[0];
        done(undefined, user);
      } else {
        const user = await createUser({
          name: profile?.name?.givenName.concat(" ", profile.name.familyName) as string,
          displayImage: profile.photos![0].value,
          email: profile.emails![0].value || "",
          googleId: profile.id
        });

        done(undefined, user);
      }
    }
  )
);

/**
 * Auth Schema...
 */

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Invalid Password!").max(255, "Invalid Password!").required("Required")
});
