/**
 * Created by kenkeller on 4/16/17.
 */

import idMap from '../lib/idMap/idMapData';
import {bindIdMap, findActs, numActs} from '../lib/idMap/idMapModule';
import * as _ from "lodash";
import app from '../app/app';
import * as $ from 'jquery';
// import * as matchers from 'jest-jquery-matchers';

describe('renders h4s', () => {
    beforeEach(function () {
        //jest.addMatchers(matchers);
    });
    it('version', () => {
        console.log(`v: ${app.v}`);
        expect(app.v).toBe(".1");
    });
    it('renders index', () => {
        app.onLoadIndex();
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

