"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const UserSchema = ts_mongoose_1.createSchema(Object.assign({ name: ts_mongoose_1.Type.string(), email: ts_mongoose_1.Type.string({ unque: true }), password: ts_mongoose_1.Type.string(), isAdmin: ts_mongoose_1.Type.optionalBoolean() }, {}));
UserSchema.methods.getAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id, isAdmin: this.isAdmin }, config_1.default.get("process.env.JWT_PRIVATE_KEY"));
    return token;
};
exports.User = ts_mongoose_1.typedModel("User", UserSchema);
//# sourceMappingURL=user.js.map