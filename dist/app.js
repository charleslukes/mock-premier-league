"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 3005;
app.get("/", (req, res) => {
    res.send("You can now use typescript for this project");
});
app.listen(port, err => {
    if (err) {
        return console.log("error");
    }
    return console.log(`server running at port ${port}`);
});
//# sourceMappingURL=app.js.map