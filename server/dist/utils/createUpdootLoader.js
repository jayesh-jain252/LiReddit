"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdootLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const Updoot_1 = require("../entity/Updoot");
const createUpdootLoader = () => new dataloader_1.default(async (keys) => {
    const updoots = await Updoot_1.Updoot.findBy(keys);
    const updootIdsToUpdoot = {};
    updoots.forEach((u) => {
        updootIdsToUpdoot[`${u.userId}|${u.postId}`] = u;
    });
    return keys.map((key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]);
});
exports.createUpdootLoader = createUpdootLoader;
//# sourceMappingURL=createUpdootLoader.js.map