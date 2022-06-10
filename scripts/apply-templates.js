console.log(" -- Templates -- ")

const fileToRead = 'umei-openapi.json';
const fileToWrite = 'generated/umei-openapi.json';
const whatToReplace = /\${description}/g;

const path = require('path');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const logAndReturn = (category, msg) => {
    console.log(`[${category}]`, (msg + "").substring(0, 70).replace(/[\r\n]/g, "") + " ...");
    return msg;
};
const logError = msg => logAndReturn('error', msg);
const logInfo = msg => logAndReturn('log', msg);

let replacement = "";
const files = ["glossary.md", "auth.md", "error-codes.md"];

files.map(file => readFileAsync(file)
    .then(buffer => buffer.toString())
    .then(text => {
        logInfo('read file ' + file + ", got contents: " + text);
        replacement += text;
        return Promise.resolve(text);
    }))
    .reduce((prev, cur) => prev.then(() => cur), Promise.resolve(""))
    .then(() => doReplace());

const doReplace = () => {
    readFileAsync(path.resolve(process.cwd(), fileToRead), 'utf8')
        .then(data => {
            logInfo(`Read file ${fileToRead}`);

            const obj = JSON.parse(data.toString());
            obj.info.description = replacement;
            const result = JSON.stringify(obj, null, "  ");

            logInfo(`Replaced ${whatToReplace} in  ${fileToRead} with ${replacement}`);

            writeFileAsync(path.resolve(process.cwd(), fileToWrite), result, 'utf8')
                .then(() => console.log('wrote replacement file ' + fileToWrite))
                .catch(err => logError(err));
        });
};
