"use strict";
/**
 * Created by kenkeller on 4/8/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const idMapData_1 = require("./idMapData");
const idMapModule_1 = require("./idMapModule");
const _ = require("lodash");
describe('idMap caches h4s dump', () => {
    beforeAll(() => {
        idMapModule_1.bindIdMap(idMapData_1.default);
    });
    it('has expected objects', () => {
        const act = idMapData_1.default["4f2db7c5af0c2e0001000011"];
        expect(act["title"]).toBe("How to separate a mixture");
        expect(act["id"]).toBe("4f2db7c5af0c2e0001000011");
        expect(act["T"]).toBe("act");
        expect(_.get(act, "term_ids[0].id")).toBe("4f2f5a8fa056bc0001000004");
        const term = idMapData_1.default["4f2f5a8fa056bc0001000004"];
        expect(term["term"]).toBe("Evaporation");
    });
    it('finds acts', () => {
        let acts;
        acts = idMapModule_1.findActs(idMapData_1.default, ["phys", "life", "earth"], [0, 1, 2, 3, 4, 5, 6]);
        expect(acts.length).not.toBe(0);
        const n = idMapModule_1.numActs(idMapData_1.default);
        const nPub = idMapModule_1.numActs(idMapData_1.default, "pub");
        const nDraft = idMapModule_1.numActs(idMapData_1.default, "draft");
        expect(acts.length).toBeLessThanOrEqual(nPub);
        console.log(`found ${acts.length} <= ${nPub} <= ${n}; #draft: ${nDraft}`);
        acts = idMapModule_1.findActs(idMapData_1.default, ["x"], [-1]);
        expect(acts.length).toBe(0);
    });
});
//# sourceMappingURL=idMapModule.test.js.map