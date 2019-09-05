"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function admin(req, res, next) {
    console.log(req["checkUser"].isAdmin);
    if (!req["checkUser"].isAdmin)
        return res.status(403).send({ data: { message: "Forbidden" } });
    next();
}
exports.default = admin;
//# sourceMappingURL=admin.js.map