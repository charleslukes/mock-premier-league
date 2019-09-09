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
const user_1 = require("../models/user");
const user_validate_1 = require("../validator/user_validate");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { error } = user_validate_1.validateUser(req.body);
    if (error)
        return res.status(404).send({ error: error.details[0].message });
    try {
        // find if the user already exits
        const { name, email } = req.body;
        let user = yield user_1.User.findOne({ email });
        if (user)
            return res
                .status(400)
                .send({ data: { message: `Email already in use` } });
        user = yield new user_1.User(req.body);
        const salt = yield bcrypt_1.default.genSalt(10);
        user.password = yield bcrypt_1.default.hash(user.password, salt);
        yield user.save();
        const message = { name, email };
        const token = user.getAuthToken();
        //saves the users token to my redis store
        req.session[user._id] = { token, data: message };
        res.send({
            data: {
                output: "sign up successfully",
                message,
                token
            }
        });
    }
    catch (error) {
        const { message } = error;
        return res.status(400).send({
            data: {
                output: "sign up failed",
                message
            }
        });
    }
});
//# sourceMappingURL=signup.js.map