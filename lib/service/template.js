var fs = require('fs');
// var md = require("node-markdown").Markdown;
var template = require("underscore.template");
var paths = require("./paths.js");
var FileObj = require("./file.js");
var Path = require("path");

//创建Index
console.log(process.cwd());
function createIndex(list){
    var tplPath = Path.join(paths.template, "template-index.html");
    var tpl = FileObj.read(tplPath);

    // var list = [{
    //     url: Path.join(paths.detailDist, "name", "name.html"),
    //     name: "wewewe"        
    // }];

    tpl = template(tpl, {
        static: paths.siteDist,
        list: list
    });

    FileObj.create(Path.join(paths.root, "index.html"), tpl);    
}

//创建详情页
function createDetail(curModule){
    var tplPath = Path.join(paths.template, "template-detail.html");
    var tpl = FileObj.read(tplPath);    

    var moduleName = curModule["name"];
    // markdown = curModule["makrdown"];
    
    curModule["static"] = paths.siteDist;
    curModule["browser"] = Path.join(paths.detailStatic, "img/browser", curModule["browser"] + ".png");
    
    if(curModule["markdown"] == undefined){
        curModule["markdown"] = null;
    }

    tpl = template(tpl, curModule);
    FileObj.create(Path.join(paths.dist, moduleName, moduleName + ".html"), tpl);
}

//创建详情页
function createEdit(curModule){
    var tplPath = Path.join(paths.template, "template-edit.html");
    var tpl = FileObj.read(tplPath);    

    var moduleName = curModule["name"];
    // markdown = curModule["makrdown"];

    tpl = template(tpl, curModule);
    FileObj.create(Path.join(paths.dist, moduleName,  "edit.html"), tpl);
}

//创建预览页
function createPreview(moduleName, html, css, js, libArr){
    var tplPath = Path.join(paths.template, "template-preview.html");
    var tpl = FileObj.read(tplPath);    

    tpl = template(tpl, {
        title: moduleName,
        moduleName: moduleName,
        html: html,
        css: css,
        js: js,
        libArr: libArr || null
    });

    FileObj.create(Path.join(paths.dist, moduleName, "preview.html"), tpl);   
}


// createIndex();
// createDetail();
// createPreview();
module.exports = {
    index: createIndex,
    preview: createPreview,
    detail: createDetail,
    edit: createEdit
}
