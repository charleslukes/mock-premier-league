import express from "express";
import mongoose from "mongoose";
import usersRoute from "./routes/index";
import bodyParser from "body-parser";
import config from "config";

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("Fatal Error: jwtPrivateKey is not defined");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/premier", { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb..."))
  .catch(err => console.log({ error: err.message }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/", usersRoute);

const port = 3005;
app.listen(port, err => {
  if (err) {
    return console.log("error");
  }

  return console.log(`server running at port ${port}`);
});
