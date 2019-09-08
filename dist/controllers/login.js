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
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const checkUser = yield user_1.User.findOne({ email });
    if (!checkUser)
        return res.status(404).send({ data: { message: "email not found" } });
    const matchPassword = yield bcrypt_1.default.compare(password, checkUser.password);
    if (!matchPassword)
        return res.status(404).send({ data: { message: "invalid password" } });
    // remeber you need to send a token in the request header
    const token = checkUser.getAuthToken();
    //save their session token when they login
    req.session[checkUser._id] = { token, data: checkUser };
    return res
        .status(200)
        .send({ data: { message: `Welcome ${checkUser.name}`, token } });
});
//# sourceMappingURL=login.js.map