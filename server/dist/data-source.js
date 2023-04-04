"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
require("dotenv").config();
const typeorm_1 = require("typeorm");
const Post_1 = require("./entity/Post");
const Updoot_1 = require("./entity/Updoot");
const User_1 = require("./entity/User");
const _1676956297102_FakePostsMigration_1 = require("./migrations/1676956297102-FakePostsMigration");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME2,
    synchronize: true,
    logging: true,
    entities: [User_1.User, Post_1.Post, Updoot_1.Updoot],
    migrations: [_1676956297102_FakePostsMigration_1.FakePostsMigration1676956297102],
    migrationsRun: true,
});
process.env.DB_NAME;
process.env.DB_USER;
process.env.DB_PASSWORD;
//# sourceMappingURL=data-source.js.map