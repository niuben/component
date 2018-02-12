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
// function createPreview(moduleName, html, css, js, parentPath,libArr){
function createPreview(curModule){
    var tplPath = Path.join(paths.template, "template-preview.html");
    var tpl = FileObj.read(tplPath);    
    
    var example = curModule["example"],
        htmlPath = example["html"],
        jsPath = Path.join(paths["source"], curModule["name"], example["js"]),
        libArr =  example["lib"] ? example["lib"] : [];    
    
    //获取库文件列表
    for(var i = 0; i < libArr.length; i++){
        libArr[i] = Path.join(paths["sourceStatic"], curModule["name"], libArr[i]);
    }

    var htmlTpl = example["html"],
        cssTpl = example["css"],
        jsTpl = FileObj.read(jsPath);

    tpl = template(tpl, {
        title: curModule["name"],
        moduleName: curModule["name"],
        html: htmlTpl,
        css: cssTpl,
        js: jsTpl,
        libArr: libArr || null,
        isModule: curModule["isModule"],
        parentPath: curModule["isModule"] == true ? Path.dirname(example["js"]) : "" 
    });

    FileObj.create(Path.join(paths.dist, curModule["name"], "preview.html"), tpl);   
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
