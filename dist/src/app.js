"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./db/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("config"));
dotenv_1.default.config();
const redisStore = connect_redis_1.default(express_session_1.default);
const client = redis_1.default.createClient();
const app = express_1.default();
if (!config_1.default.get("process.env.JWT_PRIVATE_KEY")) {
    console.error("Fatal Error: process.env.JWT_PRIVATE_KEY is not defined");
    process.exit(1);
}
console.log("hiiii", process.env.TEST, process.env.PROD);
const connectionString = process.env.NODE_ENV === "test" ? process.env.TEST : process.env.PROD;
mongoose_1.default
    .connect(connectionString, {
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(() => {
    index_1.default();
    console.log("connected to mongodb...");
})
    .catch(err => {
    console.log({ error: err.message });
    process.exit(1);
});
app.use(express_session_1.default({
    secret: config_1.default.get("process.env.JWT_PRIVATE_KEY"),
    // create new redis store.
    store: new redisStore({
        host: "localhost",
        port: 6379,
        client: client,
        ttl: 10
    }),
    saveUninitialized: false,
    resave: false
}));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use("/api", routes_1.default);
const port = process.env.PORT || 6000;
app.listen(port, () => {
    return console.log(`server running at port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map