// var JSON = require("json");
var FileObj = require("./file.js");
var fs = require('fs');


function createFile(path, content){    
    return fs.writeFileSync(path, content);
};

function readFile(path) {
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

function getMDTitle(path) {
    var content = fs.readFileSync(path).toString();
    if(content.length == 0) {
        return null;
    }
    var dom = new jsdom.JSDOM(md(content));
    var document = dom.window.document;
    return document.body.childNodes[0].innerHTML;
}

//搜索文件
function searchFile(fileName, fileObj) {
    var arr = fileObj.files;
    for(var i = 0; i < arr.length - 1; i++){
        if(arr[i]["name"].toLocaleLowerCase() == fileName.toLocaleLowerCase()){
            return arr[i]["content"];
        }
        if(typeof arr[i]["files"] == "object"){
            return searchFile(fileName, arr[i]);
        }
    }
    return;
}
function getJSONByDir(path){
    // var titleArr = [];
    var fileName = getFileName(path);
    var fileObj = {        
    };
    
    var files = fs.readdirSync(path);
    files.forEach(function(file){
        var pathName = path + "/" + file;
        var stat = fs.lstatSync(pathName);
        
        //屏蔽"."开头的文件夹
        if(file.indexOf(".") == 0) {
            return;
        }

        if(file == "node_modules"){
            return;
        }

        if(stat.isDirectory()){                    
            fileObj[file] = getJSONByDir(pathName);
        }else{  
            var content = readFile(pathName);            
            fileObj[file] = content;            
            // fileObj[file] = null;            
        }
    });
    return fileObj;
};

// getJSONByDir("../code/dropdown")
// FileObj.create("../site/static/data/" + "test" + ".js", "var modules1= " + JSON.stringify(getJSONByDir("../code/react-viewport-slider"), null, 2));
module.exports = {
    toJSON: getJSONByDir
}