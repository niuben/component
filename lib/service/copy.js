var FileObj = require("./file.js");
var Path = require("path");
var Dir = require("./dir.js");
var Parse = require("./parse.js");
var Obj = require("./object.js");
var fs = require("fs");
var Sass = require("./sass.js");
var dll = require("./dll.js");
var paths = require("./paths.js");
var Component = require("./component.js");
var argv = require("optimist").argv;
var Template = require("./template.js");
var Marked = require("marked");
const {exec} = require("child_process");
const copydir = require("copy-dir");
var cpFile = require("cp-file");

function init(curModule){
    console.log(curModule);
    // curModule = { 
    //     url: 'https://github.com/gdowens/react-toggle-button.git',
    //     isCover: true,
    //     version: '2.2.0',
    //     content: 'A React Component.',
    //     browser: 'ie6',
    //     type: 1,
    //     demo: './demo/',
    //     html: './demo/index.html',
    //     name: 'react-toggle-button' 
    // }

    
    copydir.sync(Path.join(modulePath, curModule["demo"]), demoPath);

    //复制HTML文件;
    // var htmlPath = Path.parse(curModule["html"]);    
    copy(Path.join(modulePath, curModule["html"]), Path.join(distModulePath, curModule["html"]), function(e){
        console.log(e);
    });
    // copydir.sync();
}

function copyDir(fromPath, toPath){

    //如果目标路径不存在则创建一份
    if(FileObj.isExit(toPath) == false){
        fs.mkdirSync(toPath);
    }

    return copydir.sync(fromPath, toPath);
}

function copyFile(fromPath, toPath){       
    return cpFile(fromPath, toPath, function(e){
        
    });
}


module.exports = {
    dir: copyDir,
    file: copyFile
}