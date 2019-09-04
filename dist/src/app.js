"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./db/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("config"));
dotenv_1.default.config();
const app = express_1.default();
if (!config_1.default.get("jwtPrivateKey")) {
    console.error("Fatal Error: jwtPrivateKey is not defined");
    process.exit(1);
}
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
    .catch(err => console.log({ error: err.message }));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use("/api", routes_1.default);
const port = 3005;
app.listen(port, err => {
    if (err) {
        return console.log("error");
    }
    return console.log(`server running at port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map