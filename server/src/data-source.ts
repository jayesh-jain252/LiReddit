import "reflect-metadata"
require("dotenv").config();
import { DataSource } from "typeorm"
import { Post } from "./entity/Post";
import { Updoot } from "./entity/Updoot";
import { User } from "./entity/User";
import {FakePostsMigration1676956297102} from "./migrations/1676956297102-FakePostsMigration"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME2,
    synchronize: true,
    logging: true,
    entities: [User,Post,Updoot],
    migrations:[FakePostsMigration1676956297102],
  migrationsRun: true,
})
process.env.DB_NAME
process.env.DB_USER
process.env.DB_PASSWORD