import express from "express";
import * as admin from "firebase-admin";
import errorhandler from "errorhandler";
import * as Sentry from "@sentry/node";
import * as serviceAccount from "./serviceAccountKey.json";

const app = express();
const port = process.env.port || 8080;
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
Sentry.init({
  dsn: process.env.SENTRY_ENV,
  attachStacktrace: true,
  debug: true,
  release: process.env.RELEASE,
  environment: "production"
});

app.use(Sentry.Handlers.requestHandler());

app.get("/", (req, res) => {
  throw new Error("Something Went Out Of Control");
  res.send("Welcome to this page.");
});

if (process.env.NODE_ENV === "production") {
  app.use(Sentry.Handlers.errorHandler());
}

if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
}

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
