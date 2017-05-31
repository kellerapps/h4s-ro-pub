"use strict";
/**
 * Created by kenkeller on 4/16/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app/app");
const $ = require("jquery");
// import * as matchers from 'jest-jquery-matchers';
describe('renders h4s', () => {
    beforeEach(function () {
        //jest.addMatchers(matchers);
    });
    it('version', () => {
        console.log(`v: ${app_1.default.v}`);
        expect(app_1.default.v).toBe(".1");
    });
    it('renders index', () => {
        app_1.default.onLoadIndex();
        const subjects = $('.subjectHeading');
        expect(subjects.get(0).innerHTML).toContain('physical science');
        expect(subjects.get(0).innerHTML).toContain('phys.png');
        expect(subjects.get(1).innerHTML).toContain('life science');
        expect(subjects.get(1).innerHTML).toContain('life.png');
        expect(subjects.get(2).innerHTML).toContain('earth science');
        expect(subjects.get(2).innerHTML).toContain('earth science');
        const li = $('li');
        expect(li.length).toBe(52);
    });
    it('renders act', () => {
        // app.onLoadAct(); TODO URLSearchParams undefined
    });
});
//# sourceMappingURL=render.test.js.map