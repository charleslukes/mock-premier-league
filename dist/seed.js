"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_seeding_1 = require("mongo-seeding");
const path_1 = __importDefault(require("path"));
const config = {
    database: "mongodb://127.0.0.1:27017/premier",
    dropDatabase: true
};
const seeder = new mongo_seeding_1.Seeder(config);
const collections = seeder.readCollectionsFromPath(path_1.default.resolve("./data"), {
    transformers: [mongo_seeding_1.Seeder.Transformers.replaceDocumentIdWithUnderscoreId]
});
seeder
    .import(collections)
    .then(() => {
    console.log("Success");
})
    .catch(err => {
    console.log("Error", err);
});
//# sourceMappingURL=seed.js.map