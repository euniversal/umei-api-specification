console.log(" -- Templates -- ")

const fileToRead = 'umei-openapi.json';
const fileToWrite = 'generated/umei-openapi.json';
const whatToReplace = /\${description}/g;

const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const logAndReturn = (category, msg) => {
    console.log(`[${category}]`, (msg + "").substring(0, 60) + " ...");
    return msg;
};
const logError = x => logAndReturn('error' + x);
const logInfo = x => logAndReturn('log', x);

let replacement = "";
const files = ["glossary.md", "error-codes.md"];

const readReplacementFiles = files
    .map(f => readFileAsync(f)
        .then(x => x.toString())
        .then(x => {
            logInfo('read file ' + f + ", got contents: " + x);
            const data = x
                .replace(/\r?\n/g, "\\n")
                .replace(/"/g, "\\\"");
            replacement += data;
            return Promise.resolve(x);
        }));

let promise = readReplacementFiles
    .reduce((prev, cur) => prev.then(() => cur), Promise.resolve());

promise
    .then(() => logInfo("promise then: "))
    .then(() => logInfo(replacement.substring(0, 30) + "..."))
    .then(() => doReplace());

const doReplace = () => {
    // replacement = `\"description\": "${replacement}", `;
    readFileAsync(fileToRead, 'utf8')
        .then(data => {
            logInfo(`Read file ${fileToRead}`);

            const result = data.replace(whatToReplace, replacement);
            logInfo(`Replaced ${replacement} in  ${fileToRead} with ${replacement.substring(0, 40)}`);

            fs.writeFile(fileToWrite, result, 'utf8', function (err) {
                if (err) return logError(err);
                console.log('wrote replacement file ' + fileToWrite);
            });
        });
};
