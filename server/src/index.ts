import express from "express";
import errorhandler from "errorhandler";

const app = express();
const port = process.env.port || 8080;

app.use(errorhandler());

app.get("/", (req, res) => {
  res.send("Welcome to this page.");
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
