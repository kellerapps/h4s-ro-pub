"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kenkeller on 3/18/17.
 */
const _ = require("lodash");
const zombies = {};
const keys = {};
const subjects = {};
const attachments = {};
let numAttachmentCollisions = 0;
let numAttachments = 0;
function dumpIdMap(idMap) {
    _.forIn(idMap, (obj, id) => {
        const T = obj["T"];
        console.log(`${T}; ${_.get(obj, "_id.$oid")}`);
        if (T == "act") {
            const subject = obj["subject"];
            subjects[subject] = true;
        }
        _.forIn(obj, (v, k) => {
            _.set(keys, `${T}.${k}`, true);
            if (Array.isArray(v) && v.length > 0 && _.has(obj, `${k}[0].$oid`)) {
                let relationship = [];
                let isPushedT = false;
                for (let i = 0; i < v.length; ++i) {
                    const kidId = _.get(obj, `${k}[${i}].$oid`);
                    if (!(kidId in idMap))
                        zombies[kidId] = true;
                    else {
                        const kid = idMap[kidId];
                        if (!isPushedT) {
                            relationship.push(kid["T"]);
                            isPushedT = true;
                        }
                        relationship.push(kidId);
                    }
                }
                const relationshipString = relationship.join('|');
                console.log(`\t${relationshipString}`);
            }
            else if (k != "_id" && _.has(v, "$oid")) {
                console.log(`\t${k}; ${v["$oid"]}`);
            }
            if (k == 'attachments') {
                _.forIn(v, (a) => {
                    const filename = a["attachment"];
                    ++numAttachments;
                    if (filename in attachments) {
                        numAttachmentCollisions += 1;
                        attachments[filename] = attachments[filename] + 1;
                    }
                    else {
                        attachments[filename] = 1;
                    }
                });
            }
        });
    });
    console.log('schema');
    _.forIn(keys, (v, k) => {
        console.log(`${k}: ${_.keys(v).sort().join("|")}`);
    });
    console.log(`#attachments: ${numAttachments}`);
    console.log(`#attachment collisions: ${numAttachmentCollisions}`);
    _.forIn(attachments, (v, k) => {
        if (v > 1)
            console.log(`attachment ${k} is in ${v} S3 buckets!`);
    });
    console.log(`subjects: ${_.keys(subjects).join("|")}`);
    console.log('zombies');
    console.log(`\t#: ${Object.keys(zombies).length}`);
    console.log(`\tids: ${Object.keys(zombies).join("|")}`);
}
exports.dumpIdMap = dumpIdMap;
function bindIdMap(idMap) {
    _.forIn(idMap, (obj, id) => {
        _.forIn(obj, (v, k) => {
            const T = obj["T"];
            /*
             if (! (T in keys))
             keys[T] = {};
             if (! (k in keys[T]))
             keys[T][k] = true;
             */
            _.set(keys, `${T}.${k}`, true);
            if (Array.isArray(v)) {
                // As in "standard_ids": [{"$oid": "4f28bdf6023c640001000089"}, ... ]
                if (v.length > 0 && typeof v[0] == "object" && "$oid" in v[0]) {
                    let kids = [];
                    for (let i = 0; i < v.length; ++i) {
                        const id = v[i]["$oid"];
                        if (id in idMap)
                            kids.push(idMap[id]);
                        else
                            zombies[id] = true;
                    }
                    obj[k] = kids;
                }
            }
            else if (v && typeof v == "object" && "$oid" in v) {
                const oid = v["$oid"];
                if (k == "_id") {
                    // As in "_id": {"$oid": "4f2db7c5af0c2e0001000011"}
                    obj["id"] = oid;
                }
                else {
                    // As in "user_id": {"$oid": "4f2db509af0c2e000100000b"}
                    obj[k] = idMap[oid];
                }
            }
        });
    });
}
exports.bindIdMap = bindIdMap;
const unapprovedEmails = ["zigotone@gmail.com", "e_w_enterprise@yahoo.com"];
// Find acts by grades AND subjects. 0 denotes kindergarten.
function findActs(idMap, subjects, grades) {
    const acts = _.filter(idMap, (obj, id) => {
        if (obj["T"] != "act")
            return false;
        if (obj["status"] != "pub")
            return false;
        const u = obj["user_id"];
        const email = u["email"];
        if (unapprovedEmails.indexOf(email) > -1)
            return false;
        if (subjects && subjects.length > 0 && subjects.indexOf(obj["subject"]) == -1)
            return false;
        if (grades && grades.length > 0) {
            const i = _.intersection(obj["grades"], grades);
            if (i.length == 0)
                return false;
        }
        return true;
    });
    return acts;
}
exports.findActs = findActs;
function numActs(idMap, status) {
    return _.reduce(idMap, function (sum, obj) {
        return sum + (obj["T"] == "act" ? (status == undefined || obj["status"] == status ? 1 : 0) : 0);
    }, 0);
}
exports.numActs = numActs;
//# sourceMappingURL=idMapModule.js.map