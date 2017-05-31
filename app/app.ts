/**
 * Created by kenkeller on 4/13/17.
 */
import idMap from '../lib/idMap/idMapData';
import * as _ from 'lodash';
import {bindIdMap, findActs, numActs} from '../lib/idMap/idMapModule';
import './css/main.css';

function prettySubject(subject: string) {
    return `${subject.replace('phys', 'physical')} science <img src="img/${subject}.png">`;
}

function prettyGrades(grades) {
    let prettyGrades = [];
    // Convert seqs i, i+1, ..., j to range i-j.
    for (let i = 0; i < grades.length; ++i) {
        let n = 0;
        let lo: number, hi: number;
        while (i < grades.length - 1 && grades[i + 1] - grades[i] == 1) {
            if (n == 0)
                lo = grades[i];
            hi = grades[i + 1]
            ++n;
            ++i;
        }
        if (n > 0)
            prettyGrades.push(`${lo}-${hi}`);
        else prettyGrades.push(grades[i]);
    }
    return `${prettyGrades.join(', ').replace('0', 'K')}`;
}

function prettyProperty(prop) {
    return _.capitalize(prop.replace("term_", "vocabulary_").replace("_clas_", "_class_").replace("_ids", "").replace(new RegExp("_", 'g'), " "));
}

function prettyTerm(term) {
    const word = term["term"];
    const def = term["def"];
    return `<li>${word}: ${def}`;
}

function prettyTerms(terms) {
    return `<ol>${_.map(terms, (term) => prettyTerm(term)).join("")}</ol>`;
}

function prettyMaterial(mat) {
    const consumable = mat["consumable"] ? "consumable" : "reusable";
    return `<li>${mat["name"]} <span class="consumable">(${consumable})</span> ${_.get(mat, "model", "")} ${_.get(mat, "mfg", "")} ${_.get(mat, "note", "")}`;
}

function prettyMaterials(mats) {
    return `<ol>${_.map(mats, (mat) => prettyMaterial(mat)).join("")}</ol>`;
}

function prettyLink(link) {
    return `<li><a target="h4s.resource" href="${link["url"]}">${link["title"]}</a>`;
}

function prettyLinks(links) {
    return `<ul>${_.map(links, (link) => prettyLink(link)).join("")}</ul>`;
}

function prettyAttachment(a) {
    const filename = a["attachment"];
    const s3 = "https://s3-us-west-1.amazonaws.com/h4s-attachments/";
    const img = filename.endsWith(".pdf") ? "" : `<br><img src="${s3}thumb_${filename}"/>`;
    return `<li><a target="h4s.resource" href="${s3}${a["attachment"]}">${a["caption"]}${img}</a>`;
}

function prettyAttachments(attachments) {
    return `<ul>${_.map(attachments, (a) => prettyAttachment(a)).join("")}</ul>`;
}

function renderSections(act: object, name: string, sections: Array<string>, handlers: {[k: string]: ((k: string, v: string) => string)}, html: Array<string>) {
    _.forEach(sections, (k) => {
        if (act[k] && (! _.isArray(act[k]) || (_.isArray(act[k]) && act[k].length > 0))) {
            let frag: string;
            if (k in handlers)
                frag = handlers[k](k, act[k]);
            else frag = act[k];
            html.push(`<div class="${name}"><span class="heading">${prettyProperty(k)}</span> <span class="content"</div>${frag}</span></div>`);
        }
    });
}

export default {
    "v": ".1",
    "onLoadIndex": () => {
        bindIdMap(idMap);

        const allActs = findActs(idMap, ["phys", "life", "earth"], [0, 1, 2, 3, 4, 5, 6]);
        const groupBySubject = _.groupBy(allActs, (act) => act["subject"]);
        _.forEach(groupBySubject, (acts, subject) => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = "subjectHeading";
            document.body.appendChild(subjectDiv);
            subjectDiv.innerHTML = prettySubject(subject);
            const actList = document.createElement('ol');
            subjectDiv.appendChild(actList);
            const sortedActs = _.sortBy(acts, (act) => act["grades"][0]);
            _.forEach(sortedActs, (act) => {
                const li = document.createElement('li');
                actList.appendChild(li);
                const a = document.createElement('a');
                a.innerText = act["title"];
                a.href = `act.html?id=${act["id"]}`;
                a.target = "activity";
                li.appendChild(a);
                li.appendChild(document.createTextNode(" "));
                const grades = act["grades"];
                const t = document.createTextNode(prettyGrades(grades));
                li.appendChild(t);
            });
        });
    },
    "onLoadAct": () => {
        bindIdMap(idMap);

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id || !(id in idMap)) {
            document.body.innerHTML = '';
            return;
        }
        const act = idMap[id];
        let html: Array<string> = [];

        const title = act["title"];
        document.title = title;
        html.push(`<h1>${title}</h1>`);

        const handlers = {
            "subject": (k, v) => prettySubject(v),
            "grades": (k, v) => prettyGrades(v),
            "term_ids": (k, v) => prettyTerms(v),
            "links": (k, v) => prettyLinks(v),
            "materials_per_clas_ids": (k, v) => prettyMaterials(v),
            "materials_per_group_ids": (k, v) => prettyMaterials(v),
            "materials_per_student_ids": (k, v) => prettyMaterials(v),
            "attachments": (k, v) => prettyAttachments(v),
            "standard_ids": (k, v) => {
                return _.map(v, (std) => std["standard_id"]).join(", ");
            }
        };

        const data = ["subject", "grades", "standard_ids", "duration", "closure_duration"];
        renderSections(act, "feature", data, handlers, html);

        html.push("<h2>Activity</h2>");
        const sections = ["objective", "background", "term_ids", "materials_note", "materials_per_clas_ids", "materials_per_group_ids", "materials_per_student_ids", "teacher_setup", "assistant_setup", "procedure", "assessment", "reflection", "note"];
        renderSections(act, "section", sections, handlers, html);

        html.push("<h2>Resources</h2>");
        const appendix = ["attachments", "links"];
        renderSections(act, "appendix", appendix, handlers, html);

        document.body.innerHTML = html.join('\n');
    }
};
