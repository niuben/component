var fs = require('fs');
// var md = require("node-markdown").Markdown;
var template = require("underscore.template");
var paths = require("./paths.js");
var FileObj = require("./file.js");
var HTML = require("./html.js");
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
    
    var modulePath = Path.join(paths["source"], curModule["name"]);
    
    //
    var obj = {};
    var example = curModule["example"];
    
    //判断
    if(example["html"].indexOf("<") == -1){
        var htmlPath = Path.join(modulePath, example["html"]);    
        var html = FileObj.read(htmlPath);            
        obj = HTML.get(html);
        //     htmlPath = example["html"],
        //     jsPath = example["js"] ? Path.join(paths["source"], curModule["name"], example["js"]) : null,
        //     cssPath = example["css"] ?  Path.join(paths["source"], curModule["name"], example["css"]) : null;
        //     libArr =  example["lib"] ? example["lib"] : [];    
        
        //获取库文件列表
        for(var i = 0; i < obj["link"].length; i++){
            obj["link"][i] = Path.join(paths["sourceStatic"], curModule["name"], obj["link"][i]);        
        }
        
        for(var i = 0; i < obj["script"].length; i++){
            obj["script"][i] = Path.join(paths["sourceStatic"], curModule["name"], obj["script"][i]);        
        }

    }else {
        obj["tpl"] = example["html"];
    }
    
    if(example["js"] != undefined && (obj["js"] == "" || obj["js"] == undefined)){
        obj["js"] = FileObj.read(Path.join(modulePath, example["js"]));
    }
        // var htmlTpl = example["html"];            
        // var cssTpl = cssPath ? FileObj.read(cssPath) : null;
        // var jsTpl = jsPath ? FileObj.read(jsPath) : null;

    tpl = template(tpl, {
        title: curModule["name"],
        moduleName: curModule["name"],
        html: obj["tpl"] != undefined ? obj["tpl"] : null,
        css: obj["css"] != undefined ? obj["css"] : null,
        js: obj["js"] != undefined ? obj["js"] : null,
        link: obj["link"] != undefined ? obj["link"] : null,
        script: obj["script"] != undefined ? obj["script"] : null,
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
