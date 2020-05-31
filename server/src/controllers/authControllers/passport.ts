import * as argon2 from "argon2";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import * as Yup from "yup";
import { Id, User } from "../../../../types";
import keys from "../../config/keys";
import getSchema from "../../config/yup";
import { UserDBRef } from "../../utils/firebaseContants";
import createUser from "./createUser";

passport.serializeUser((user: User & Id, done) => {
  done(null, { id: user.id, name: user.name });
});

passport.deserializeUser((user: Pick<User & Id, "id" | "name">, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (_, email, password, done) => {
    try {
      await SignInSchema.validate({ email, password });

      const userDocs = await UserDBRef().where("email", "==", email).get();
      if (userDocs.empty) return done(null, false);

      const user: User & Id = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as User & Id))[0];

      const validPassword = await argon2.verify(user.password!, password);
      if (!validPassword) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(null, false, { message: "Wrong Email or Password" });
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.gooogleClientSecret,
      callbackURL: `/api/auth/google/callback`
    },
    async (_, __, profile, done) => {
      const userDocs = await UserDBRef().where("googleID", "==", profile.id).get();

      if (!userDocs.empty) {
        const user: User = userDocs.docs.map(doc => doc.data() as User)[0];
        done(undefined, user);
      } else {
        const user = await createUser({
          name: profile.displayName,
          displayImage: profile.photos![0].value,
          email: profile.emails![0].value,
          googleId: profile.id
        });

        done(undefined, user);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: `/api/auth/facebook/callback`,
      profileFields: ["name", "emails", "picture.type(large)"]
    },
    async (_, __, profile, done) => {
      const userDocs = await UserDBRef().where("facebookId", "==", profile.id).get();

      if (!userDocs.empty) {
        const user: User = userDocs.docs.map(doc => doc.data() as User)[0];
        done(undefined, user);
      } else {
        const user = await createUser({
          name: profile?.name?.givenName.concat(" ", profile.name.familyName) as string,
          displayImage: profile.photos![0].value,
          email: profile.emails![0].value,
          facebookId: profile.id
        });

        done(undefined, user);
      }
    }
  )
);

/**
 * Validation Schema
 */
const SignInSchema = getSchema({
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Invalid Password!").max(255, "Invalid Password!").required("Required")
});
