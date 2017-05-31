/**
 * Created by kenkeller on 4/9/17.
 */

import {dumpIdMap} from './idMapModule';
import {saveIdMap, restoreIdMap} from './restore';
import * as _ from "lodash";

if (!module.parent) {
    console.log('gen idMap...');
    const ti = _.now();
    let restoreTime: number;
    restoreIdMap().then((idMap) => {
        restoreTime = _.now() - ti;
        console.log(`idMap restored in ${restoreTime}msec`);
        dumpIdMap(idMap);
        saveIdMap(idMap, "lib/idMap/idMapData.ts");
    }).catch((err: Error) => {
        console.log(`gen failed because ${err}`);
    });
}
