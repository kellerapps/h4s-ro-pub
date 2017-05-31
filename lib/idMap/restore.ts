/**
 * Created by kenkeller on 4/13/17.
 */
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as _ from "lodash";

function readMongoJsonPromise(filename: string): Promise<Array<string>> {
    const iPromise = new Promise<Array<string>>((fulfill: (lines: Array<string>) => void, reject: (err: Error) => void) => {
        const jsonsFile = path.join("lib/idMap/h4s.json/", `${filename}.jsons`);
        fs.stat(jsonsFile, (err, stat) => {
            let lines: Array<string> = [];
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

async function readMongoJson(filename: string): Promise<Array<string>> {
    const lines: Array<string> = await readMongoJsonPromise(filename);
    return lines;
}

const idMap = {};

function cacheLine(line: string, T: string) {
    const obj = JSON.parse(line);
    const oid = <string>_.get(obj, "_id.$oid");
    idMap[oid] = obj;
    obj["T"] = T;
    return obj;
}

function cacheMaterials(lines: Array<string>): void {
    lines.forEach(line => {
        const obj = cacheLine(line, "material");
    });
}

function cacheTerms(lines: Array<string>): void {
    lines.forEach(line => {
        const obj = cacheLine(line, "term");
    });
}

function cacheUsers(lines: Array<string>): void {
    lines.forEach(line => {
        const obj = cacheLine(line, "user");
    });
}

function cacheActs(lines: Array<string>): void {
    lines.forEach(line => {
        const obj = cacheLine(line, "act");
    });
}

function cacheStds(lines: Array<string>): void {
    lines.forEach(line => {
        const obj = cacheLine(line, "std");
    });
}

const filenames = ['materials', 'standards', 'terms', 'users', 'acts'];
const cachers = [cacheMaterials, cacheStds, cacheTerms, cacheUsers, cacheActs];

export function restoreIdMap(): Promise<object> {
    const promises: Array<Promise<Array<string>>> = filenames.map((filename: string) => {
        return readMongoJsonPromise(filename);
    });
    return new Promise((fulfill: (idMapArg: object) => void, reject: (err: Error) => void) => {
        Promise.all<Array<string>>(promises).then((results: Array<Array<string>>) => {
            results.forEach((lines: Array<string>, i: number) => cachers[i](lines));
            fulfill(idMap);
        }).catch(err => reject(err));
    });
}

export function saveIdMap(idMap, filename: string): void {
    const idMapString = JSON.stringify(idMap);
    fs.writeFileSync(filename, `export default ${idMapString};`);
}