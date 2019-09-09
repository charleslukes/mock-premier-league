"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const redisStore = connect_redis_1.default(express_session_1.default);
const client = redis_1.default.createClient(process.env.REDIS_URL);
const app = express_1.default();
// if (!config.get("process.env.JWT_PRIVATE_KEY")) {
//   console.error("Fatal Error: process.env.JWT_PRIVATE_KEY is not defined");
//   process.exit(1);
// }
const connectionString = process.env.NODE_ENV === "test" ? process.env.TEST : process.env.PROD;
mongoose_1.default
    .connect(connectionString, {
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(() => __awaiter(this, void 0, void 0, function* () {
    process.env.NODE_ENV !== "test" && (yield index_1.default());
    console.log("connected to mongodb...");
}))
    .catch(err => {
    console.log({ error: err.message });
    process.exit(1);
});
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(express_session_1.default({
    secret: process.env.JWT_PRIVATE_KEY,
    // create new redis store.
    store: new redisStore({
        host: "localhost",
        port: 6379,
        client: client,
        ttl: 1800
    }),
    saveUninitialized: false,
    resave: false
}));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use("/api/v1", routes_1.default);
const port = process.env.PORT || 3005;
app.listen(port, () => {
    return console.log(`server running at port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map