import express from "express";
import * as admin from "firebase-admin";
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

app.get("/", (req, res) => {
  res.send("Welcome to this page.");
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
