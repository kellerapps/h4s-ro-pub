"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kenkeller on 4/13/17.
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const _ = require("lodash");
function readMongoJsonPromise(filename) {
    const iPromise = new Promise((fulfill, reject) => {
        const jsonsFile = path.join("lib/idMap/h4s.json/", `${filename}.jsons`);
        fs.stat(jsonsFile, (err, stat) => {
            let lines = [];
            if (err) {
                reject(err);
                return;
            }
            const rl = readline.createInterface({
                input: fs.createReadStream(jsonsFile, "utf-8")
            });
            rl.on('line', (line) => {
                lines.push(line);
            });
            rl.on('close', _ => fulfill(lines));
        });
    });
    return iPromise;
}
function readMongoJson(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const lines = yield readMongoJsonPromise(filename);
        return lines;
    });
}
const idMap = {};
function cacheLine(line, T) {
    const obj = JSON.parse(line);
    const oid = _.get(obj, "_id.$oid");
    idMap[oid] = obj;
    obj["T"] = T;
    return obj;
}
function cacheMaterials(lines) {
    lines.forEach(line => {
        const obj = cacheLine(line, "material");
    });
}
function cacheTerms(lines) {
    lines.forEach(line => {
        const obj = cacheLine(line, "term");
    });
}
function cacheUsers(lines) {
    lines.forEach(line => {
        const obj = cacheLine(line, "user");
    });
}
function cacheActs(lines) {
    lines.forEach(line => {
        const obj = cacheLine(line, "act");
    });
}
function cacheStds(lines) {
    lines.forEach(line => {
        const obj = cacheLine(line, "std");
    });
}
const filenames = ['materials', 'standards', 'terms', 'users', 'acts'];
const cachers = [cacheMaterials, cacheStds, cacheTerms, cacheUsers, cacheActs];
function restoreIdMap() {
    const promises = filenames.map((filename) => {
        return readMongoJsonPromise(filename);
    });
    return new Promise((fulfill, reject) => {
        Promise.all(promises).then((results) => {
            results.forEach((lines, i) => cachers[i](lines));
            fulfill(idMap);
        }).catch(err => reject(err));
    });
}
exports.restoreIdMap = restoreIdMap;
function saveIdMap(idMap, filename) {
    const idMapString = JSON.stringify(idMap);
    fs.writeFileSync(filename, `export default ${idMapString};`);
}
exports.saveIdMap = saveIdMap;
//# sourceMappingURL=restore.js.map