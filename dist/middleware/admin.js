"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function admin(req, res, next) {
    console.log(req["user"].isAdmin);
    if (!req["checkUser"].isAdmin)
        return res.status(403).send("Access denied");
    next();
}
exports.default = admin;
//# sourceMappingURL=admin.js.map