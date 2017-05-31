"use strict";
/**
 * Created by kenkeller on 4/9/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const idMapModule_1 = require("./idMapModule");
const restore_1 = require("./restore");
const _ = require("lodash");
if (!module.parent) {
    console.log('gen idMap...');
    const ti = _.now();
    let restoreTime;
    restore_1.restoreIdMap().then((idMap) => {
        restoreTime = _.now() - ti;
        console.log(`idMap restored in ${restoreTime}msec`);
        idMapModule_1.dumpIdMap(idMap);
        restore_1.saveIdMap(idMap, "lib/idMap/idMapData.ts");
    }).catch((err) => {
        console.log(`gen failed because ${err}`);
    });
}
//# sourceMappingURL=genIdMap.js.map