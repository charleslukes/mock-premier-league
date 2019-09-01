"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.validateTeam = (input) => {
    const schema = {
        name: joi_1.default.string()
            .min(3)
            .max(255)
            .required(),
        email: joi_1.default.string()
            .email()
            .required(),
        coach: joi_1.default.string()
            .email()
            .required(),
        country: joi_1.default.string()
            .min(3)
            .max(255)
            .required(),
        stadium_name: joi_1.default.string()
            .min(3)
            .max(255)
            .required(),
        stadium_capacity: joi_1.default.string()
            .min(3)
            .max(255)
            .required(),
        founded: joi_1.default.number().required()
    };
    return joi_1.default.validate(input, schema);
};
//# sourceMappingURL=team_validate.js.map