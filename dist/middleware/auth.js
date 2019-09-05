"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const user_1 = require("../models/user");
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = req.headers.authorization.split(" ")[1];
            console.log("heyyyy", payload);
            if (!payload)
                return res
                    .status(401)
                    .send({ data: { message: "access denied no token provided" } });
            const decoded = jsonwebtoken_1.default.verify(payload, config_1.default.get("jwtPrivateKey"));
            const user = yield user_1.User.findById(decoded._id);
            if (user) {
                req["checkUser"] = user;
                next();
            }
            else {
                res.status(401).send({ data: { message: "user does not exist" } });
            }
        }
        catch (error) {
            res.status(400).send(error);
        }
    });
}
exports.default = auth;
//# sourceMappingURL=auth.js.map