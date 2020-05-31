import * as Sentry from "@sentry/node";
import session from "cookie-session";
import express from "express";
import passport from "passport";
import "./config/firebase";
import keys from "./config/keys";
import "./controllers/authControllers/passport";
import { verifyAuth } from "./middleware/authMiddleware";
import { authRoutes, projectRoutes } from "./routes";

const app = express();
app.enable("trust proxy");

// ERROR HANDLER
Sentry.init({
  dsn: keys.sentryDSN,
  attachStacktrace: true,
  debug: true,
  release: keys.release,
  environment: keys.nodeEnv,
  beforeSend: (event, hint) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(hint?.originalException);
      return null;
    }
    return event;
  }
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

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
 * ROUTES
 */
// TODO: Place this route into correct folder, after hosting is configured
app.get("/", verifyAuth, (_, res) => res.send("Logged In!"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
