/**
 * Created by kenkeller on 4/8/17.
 */

import idMap from './idMapData';
import {bindIdMap, findActs, numActs} from './idMapModule';
import * as _ from "lodash";

describe('idMap caches h4s dump', () => {
    beforeAll(() => {
        bindIdMap(idMap);
    });
    it('has expected objects', () => {
        const act = idMap["4f2db7c5af0c2e0001000011"];
        expect(act["title"]).toBe("How to separate a mixture");
        expect(act["id"]).toBe("4f2db7c5af0c2e0001000011");
        expect(act["T"]).toBe("act");
        expect(_.get(act, "term_ids[0].id")).toBe("4f2f5a8fa056bc0001000004");
        const term = idMap["4f2f5a8fa056bc0001000004"];
        expect(term["term"]).toBe("Evaporation");
    });
    it('finds acts', () => {
        let acts: Array<object>;
        acts = findActs(idMap, ["phys", "life", "earth"], [0, 1, 2, 3, 4, 5, 6]);
        expect(acts.length).not.toBe(0);
        const n = numActs(idMap);
        const nPub = numActs(idMap, "pub");
        const nDraft = numActs(idMap, "draft");
        expect(acts.length).toBeLessThanOrEqual(nPub);
        console.log(`found ${acts.length} <= ${nPub} <= ${n}; #draft: ${nDraft}`);
        acts = findActs(idMap, ["x"], [-1]);
        expect(acts.length).toBe(0);
    });
});
