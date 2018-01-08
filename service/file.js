// var JSON = require("json");
var fs = require('fs');

function createFile(path, content){    
    return fs.writeFileSync(path, content);
};

function readFile(path, optin) {
    var buf = fs.readFileSync(path);    
    return buf.toString();
}

function getFileType(fileName) {
    var fileNameArr = fileName.split('.');
    return fileNameArr[fileNameArr.length - 1];
}

function getFileName(path){
    var pathArr = path.split('/');
    return pathArr[pathArr.length - 1];
}

function isExit(path){
    return fs.existsSync(path);
}

module.exports = {
    create: createFile,
    read: readFile,
    getType: getFileType,
    isExit: isExit
}