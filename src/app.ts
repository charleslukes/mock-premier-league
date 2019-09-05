import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import mongoose from "mongoose";
import apiRouter from "./routes";
import dotenv from "dotenv";
import seedDb from "./db/index";
import bodyParser from "body-parser";
import config from "config";

dotenv.config();

const redisStore = connectRedis(session);
const client = redis.createClient();
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("Fatal Error: jwtPrivateKey is not defined");
  process.exit(1);
}

const connectionString =
  process.env.NODE_ENV === "test" ? process.env.TEST : process.env.PROD;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(async () => {
    process.env.NODE_ENV !== "test" && (await seedDb());
    console.log("connected to mongodb...");
  })
  .catch(err => {
    console.log({ error: err.message });
    process.exit(1);
  });

app.use(
  session({
    secret: config.get("jwtPrivateKey"),
    // create new redis store.
    store: new redisStore({
      host: "localhost",
      port: 6379,
      client: client,
      ttl: 260
    }),
    saveUninitialized: false,
    resave: false
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/api", apiRouter);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  return console.log(`server running at port ${port}`);
});

export default app;
