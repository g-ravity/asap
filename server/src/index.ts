import * as admin from "firebase-admin";
import errorhandler from "errorhandler";
import * as Sentry from "@sentry/node";
import session from "cookie-session";
import passport from "passport";
import express from "express";
import keys from "./utils/keys";
import * as serviceAccount from "./serviceAccountKey.json";

const app = express();
app.enable("trust proxy");

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
};

admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL: "https://asap-9b414.firebaseio.com"
});

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

app.listen(keys.port, () => {
  console.log(`Server is listening on port: ${keys.port}`);
});
