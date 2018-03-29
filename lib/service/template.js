var fs = require('fs');
// var md = require("node-markdown").Markdown;
var template = require("underscore.template");
var paths = require("./paths.js");
var FileObj = require("./file.js");
var Parse = require("./parse.js");
var HTML = require("./html.js");
var path = require("path");
var Component = require("./component.js");
var os = require("os");
//创建Index

function createIndex(){
    var list = Component.getList();
    var tplPath = path.join(paths.template, "template-index.html");
    var tpl = FileObj.read(tplPath);

    // 
    list.map(function(curModule){
        if(typeof curModule !== "object"){
            return false;
        }
        //判断组件文件夹是否存在；如果不存在的创建一个新的文件夹;
        // var curModulePath = Path.join(paths.dist, curModule["name"]);  
        // if(FileObj.isExit(curModulePath) == false){
        //     fs.mkdirSync(curModulePath);
        // }        
        curModule["url"] = path.join(paths["dist"], curModule["name"],  curModule["name"] + ".html");
        curModule["url"] = path.relative(paths["root"], curModule["url"]);

        curModule["image"] = path.join(paths["dist"], curModule["name"], "preview.png");
        curModule["image"] = path.relative(paths["root"], curModule["image"]);
        
        if(os.type() == "Windows_NT"){
            curModule["image"] = curModule["image"].replace(/\\/g, "\/");
        }        
        return curModule;
    });
        
    var static = path.relative(paths["root"], paths["siteDist"]);
    tpl = template(tpl, {
        static: static,
        list: list
    });

    FileObj.create(path.join(paths.root, "index.html"), tpl);    
}

//创建详情页
function createDetail(curModule){
    var tplPath = path.join(paths.template, "template-detail.html");
    var tpl = FileObj.read(tplPath);    

    var moduleName = curModule["name"];
    var fromPath = path.join(paths["dist"], moduleName);
    // markdown = curModule["makrdown"];
    
    curModule["static"] = path.relative(fromPath, paths["siteDist"]);
    curModule["browser"] = path.join(path.relative(fromPath, paths["static"]), "img/browser", curModule["browser"] + ".png");
    
    if(curModule["markdown"] == undefined){
        curModule["markdown"] = null;
    }
    tpl = template(tpl, curModule);
    FileObj.create(path.join(paths["dist"], moduleName, moduleName + ".html"), tpl);
    
}

//创建详情页
function createEdit(curModule){
    var tplPath = path.join(paths.template, "template-edit.html");
    var tpl = FileObj.read(tplPath);    

    var moduleName = curModule["name"];
    // markdown = curModule["makrdown"];

    tpl = template(tpl, curModule);
    FileObj.create(path.join(paths.dist, moduleName,  "edit.html"), tpl);
}

//创建预览页
// function createPreview(moduleName, html, css, js, parentPath,libArr){
function createPreview(curModule){
    var tplPath = path.join(paths.template, "template-preview.html");
    var tpl = FileObj.read(tplPath);    
    
    var modulePath = path.join(paths["source"], curModule["name"]);        
    var moduleName = curModule["name"];
    var obj = {};    
    
    //判断    
    var htmlPath = path.join(modulePath, curModule["html"]);    
    var html = FileObj.read(htmlPath);         
    obj = HTML.get(html);
    
    //获取库文件列表
    for(var i = 0; i < obj["link"].length; i++){
        obj["link"][i] = path.join(paths["sourceStatic"], curModule["name"], obj["link"][i]);        
    }
    
    for(var i = 0; i < obj["script"].length; i++){
        obj["script"][i] = path.join(paths["sourceStatic"], curModule["name"], obj["script"][i]);        
    }
    
    
    // if(example["js"] != undefined && (obj["js"] == "" || obj["js"] == undefined)){
    //     obj["js"] = FileObj.read(path.join(modulePath, example["js"]));
    // }
        // var htmlTpl = example["html"];            
        // var cssTpl = cssPath ? FileObj.read(cssPath) : null;
        // var jsTpl = jsPath ? FileObj.read(jsPath) : null;

    //获取alias类别
    // var alias = {};
    // if(curModule["isModule"] == true){
    //     var entryPath = getEntry(curModule);
    //     var entryContent = FileObj.read(entryPath);
    //     var libArr = Parse.file(entryContent);
    //     libArr.map(function(name){            
            
    //         var libPath;             
    //         if(name !== moduleName){
    //             libPath = path.join(paths["source"], moduleName, "node_modules", name);
    //         }else{
    //             libPath = modulePath;
    //         }

    //         var libEntry = Parse.getMain(libPath);
    //         alias[name] = path.join(name, libEntry);
    //     });
        
    //     //增加模块别名说明
    //     // var moduleEntry = Parse.getMain(modulePath);
    //     // alias[moduleName] = path.join(moduleName, moduleEntry);
    // }
    // console.log(moduleName, alias);

    tpl = template(tpl, {
        title: curModule["name"],
        moduleName: curModule["name"],
        html: obj["tpl"] != undefined ? obj["tpl"] : null,
        css: obj["css"] != undefined ? obj["css"] : null,
        js: obj["js"] != undefined ? obj["js"] : null,
        link: obj["link"] != undefined ? obj["link"] : null,
        script: obj["script"] != undefined ? obj["script"] : null,                        
    });
    FileObj.create(path.join(paths.dist, curModule["name"], "preview.html"), tpl);    
}

//获取Demo文件
function getEntry(curModule){    
    var example = curModule["example"];
    if(example !== undefined){
        return path.join(paths["source"], curModule["name"], example["js"]);
    }
    return curModule["entry"];
}

// createIndex();
// createDetail();
// createPreview();
module.exports = {
    index: createIndex,
    preview: createPreview,
    detail: createDetail,
    edit: createEdit,
    getEntry: getEntry
}
