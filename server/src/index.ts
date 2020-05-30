import * as Sentry from "@sentry/node";
import errorhandler from "errorhandler";
import session from "cookie-session";
import passport from "passport";
import express from "express";
import "./config/firebase";
import keys from "./config/keys";
import "./controllers/authControllers/passport";
import * as authControllers from "./controllers/authControllers";

const app = express();
app.enable("trust proxy");

// ERROR HANDLER
if (keys.nodeEnv === "development") {
  app.use(errorhandler());
} else {
  Sentry.init({
    dsn: keys.sentryDSN,
    attachStacktrace: true,
    debug: true,
    release: keys.release,
    environment: "production"
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}

// COOKIE SESSION
app.use(
  session({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secret: keys.cookieSecret
  })
);

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// BODYPARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* eslint-disable-next-line no-console */
app.listen(keys.port, () => console.log(`Server is listening on port: ${keys.port}`));

/**
 * ROUTES...
 */

/* User Routes */
app.post("/api/signUp", authControllers.signUp);
app.post("/api/signIn", authControllers.signIn);
app.get("/api/signOut", authControllers.signOut);
app.get("/api/auth/google", authControllers.googleOAuth);
app.get("/api/auth/google/callback", authControllers.googleOAuthCallback);
app.get("/api/auth/facebook", authControllers.facebookOAuth);
app.get("/api/auth/facebook/callback", authControllers.facebookOAuthCallback);
