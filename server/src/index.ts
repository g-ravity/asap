import * as Sentry from "@sentry/node";
import session from "cookie-session";
import express from "express";
import passport from "passport";
import cors from "cors";
import "./config/firebase";
import keys from "./config/keys";
import { authRoutes, baseRoutes, projectRoutes } from "./routes";
import "./utils/passport.utils";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
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
    secret: keys.cookieSecret,
    httpOnly: false
  })
);

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// BODYPARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(keys.port, () => console.log(`Server is listening on port: ${keys.port}`));

/**
 * ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", baseRoutes);
