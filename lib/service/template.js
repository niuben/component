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
function createDetail(moduleName, markdown){
    var tplPath = Path.join(paths.template, "template-detail.html");
    var tpl = FileObj.read(tplPath);    

    tpl = template(tpl, {
        title: moduleName,
        markdown: markdown
    });

    FileObj.create(Path.join(paths.dist, moduleName, moduleName + ".html"), tpl);
}

//创建预览页
function createPreview(moduleName, html, code){
    var tplPath = Path.join(paths.template, "template-preview.html");
    var tpl = FileObj.read(tplPath);    

    tpl = template(tpl, {
        title: moduleName,
        moduleName: moduleName,
        html: html,
        code: code
    });

    FileObj.create(Path.join(paths.dist, moduleName, "preview.html"), tpl);
    
}


// createIndex();
// createDetail();
// createPreview();
module.exports = {
    index: createIndex,
    preview: createPreview,
    detail: createDetail
}
