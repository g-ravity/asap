import * as Sentry from "@sentry/node";
import errorhandler from "errorhandler";
import session from "cookie-session";
import passport from "passport";
import express, { Request, Response, NextFunction } from "express";
import "./config/firebase";
import keys from "./config/keys";
import "./controllers/authControllers/passport";
import * as authControllers from "./controllers/authControllers";
import * as projectController from "./controllers/projectController";

const app = express();
app.enable("trust proxy");

// ERROR HANDLER
if (keys.nodeEnv === "development") {
  app.use(errorhandler());
}
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

// AUTH MIDDLEWARE
const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  console.log("User: ", req.user);
  console.log("Request Body: ", req.body);
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Authorized!");
  }
};

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
// Project Routes
app.post("/api/projects/", verifyAuth, projectController.addProject);
app.put("/api/projects/:projectId", verifyAuth, projectController.updateProject);
app.delete("/api/projects/:projectId", verifyAuth, projectController.deleteProject);

app.get("/", verifyAuth, (req, res) => res.send("Working !! "));
