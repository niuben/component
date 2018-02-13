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

//递归解析文件
function Init(){
    var moduleListArr = Component.getList();
    var modulesArr = Component.getListName(moduleListArr);
    
    //获取历史文件和当前文件进行Diff，如何历史文件的修改时间和当前修改时间一致证明当前文件没有被改变则不对其做打包
    var historyModulePath = Path.join(paths["dist"], "historymodule.json");
    var historyModuleArr = [];
    if(FileObj.isExit(historyModulePath)){
        historyModuleArr = JSON.parse(FileObj.read(historyModulePath));
    }

    //获取每个文件的修改时间
    var moduleMTimeList = {};
    moduleListArr.map(function(curModule){       
        
        //
        var name = curModule["name"]; 
        if(name == "slider"){
            return;
        }
        
        
        var mtime = null;       
        if(name != undefined){
            var statObj = fs.statSync(Path.join(paths["component"], name + ".json"));
            mtime = statObj["mtimeMs"];
            curModule["mtime"] = mtime;
        }
        
        //
        historyModuleArr.map(function(historyCurModule){
            if(historyCurModule["name"] == name && historyCurModule["mtime"] == mtime){
                curModule["isChange"] = false;
            }
        });

        if(curModule["isChange"] != false){
            curModule["isChange"] = true;
        }
        
    });
    FileObj.create(historyModulePath, JSON.stringify(moduleListArr));        

    //创建文件列表
    var list = [];
    moduleListArr.map(function(curModule){
        if(typeof curModule !== "object"){
            return false;
        }    

        curModule["url"] = Path.join(paths.detailDist, curModule["name"],  curModule["name"] + ".html");
        curModule["image"] = Path.join(paths.imgStatic, curModule["image"]);
        list.push(curModule);
    });
        
    Template.index(list);
    console.log("首页生成完毕");

    
    moduleListArr.map(function(curModule){
        if(typeof curModule !== "object"){
            return;
        }
        
        if(curModule["isChange"] == false){
            return;
        }
        
        //如果组件是非模块化的话则直接生成
        if(curModule["isModule"] == false){            
            //创建详情页
            var markdown = FileObj.read(Path.join(paths["source"], curModule["name"], "readme.md"));
            markdown = Marked(markdown);
            curModule["markdown"] = markdown;

            Template.detail(curModule);        
            Template.edit(curModule);                        
            Template.preview(curModule);

            return;
        }
        

        var sourcePath = getSourcePath(curModule); 
        if(fs.existsSync(Path.join(sourcePath, curModule["name"]))){
            // create([moduleName], [moduleListArr[index]]);
            create(curModule);
        }else {
            Component.download(modulesArr, function(){
                // create([moduleName], [moduleListArr[index]]);
                create(curModule);
            })
        }
    });    
}

// function create(modulesArr, moduleListArr){
function create(curModule){
    
    // var basePath =  __dirname + "/../code/";
    var basePath = getSourcePath(curModule);
    var moduleName = curModule["name"];
    // var modulesArr = ["react-viewport-slider"];
    // var modulesArr = ["stepbar"];

    // modulesArr.map(function(moduleName, index){

        // if(index ==  0){
        //     return;
        // }
        // var path = basePath + moduleName;
        // var fileJSON = Dir.toJSON(path);        

    var fileJSON = createJson(basePath, moduleName);
        
    var moduleJSON = Parse.module(moduleName, fileJSON);                
    moduleJSON["module"] = Obj.clear(moduleJSON["module"]);
    moduleJSON["module"] = Sass.parse(moduleJSON["module"]);
    
    // var baseUrl = "https://webpack-dll-prod.herokuapp.com/v6/";
    var libList = moduleJSON["lib"];                              
    dll.download(libList, function(){
        
        //获取入口文件            
        // var nodeModulesPath = Path.join(path, "/node_modules");  
        var nodeModulesPath = Path.join("./node_modules");  
        
        if(fs.existsSync(nodeModulesPath)){                
            for(var libName in libList){
                var packagePath = Path.join(nodeModulesPath, libName, "package.json"),
                    package = JSON.parse(FileObj.read(packagePath)),
                    mainPath = package["main"];
                
                mainPath = libName + "/" + mainPath;
                libList[libName] = mainPath;
            }                
        }
        
        console.log("正在创建", moduleName, "页面....");

        dll.create(moduleName, libList, ()=>{
            var manifest = FileObj.read(Path.join(paths["dist"], moduleName ,"manifest.json"));                
            manifest = JSON.parse(manifest);
            // moduleJSON["manifest"] = manifest;

            //获取入口文件对应的ID号
            for(var libName in libList){
                var entryPath = libList[libName];
                
                for(var fileName in manifest["content"]){
                    // console.log(fileName);
                    if(fileName.indexOf(entryPath) != -1){
                        libList[libName] = manifest["content"][fileName]["id"];
                    }
                }
            }

            // console.log(libList);
            moduleJSON["lib"] = libList;            
            // console.log(moduleJSON)
            FileObj.create(Path.join(paths["dist"], moduleName, moduleName + ".js"), "var modules=" + JSON.stringify(moduleJSON));
            
            //创建详情页
            var markdown = Obj.getContentFromPath("./readme.md", moduleJSON["module"]);
            markdown = Marked(markdown);

            curModule["markdown"] = markdown;
            Template.detail(curModule);
        
            Template.edit(curModule);

            //创建预览页
            // var example = moduleListArr[index]["example"],
            // var example = curModule["example"],
            //     htmlPath = example["html"],
            //     jsPath = example["js"];
            
            // // htmlPath = Path.join(paths["code"], moduleName, htmlPath);
            // jsPath = Path.join(paths["code"], moduleName, jsPath);
            
            // var htmlTpl = example["html"],
            //     cssTpl = example["css"],
            //     jsTpl = FileObj.read(jsPath);

            // Template.preview(moduleName, htmlTpl, cssTpl, jsTpl);            
            Template.preview(curModule);
            console.log(moduleName, "页生成完毕");
            
        });
    })
    
}

/*
* 获得模块根路径
* 组件的isModule为true,证明是模块化组件
* 判断是否提供组件代码路径。如果提供了路径则使用提供路径，如果没有提供路径则默认为”node_modules“下路径
*/
function getSourcePath(curModule){
    if(curModule["source"] == undefined){
        return paths["code"]
    }

    return Path.join(paths["source"]);
}   

//
function createJson(basePath, moduleName){
    var path = Path.join(basePath,  moduleName);
    var fileJSON = Dir.toJSON(path);
    return fileJSON;
}

//合并路径 /a/b + ../c => /a/c 
function contactPath(path, curPath){    
    return Path.join(path, curPath);
}



// var a = {
//     a: {
//         "b.js": "123123123"
//     },
//     c: {
//         "d.js": "23232323",
//         e: {
//             "g.js": "23232323111"
//         }
//     }
// }

// console.log(clearObj(a));
// console.log(contactPath("/a/b", "../c"));
// console.log(getObjFromPath("./c/e/g.js", a));
// console.log(Dir.toJson("../code/dropdown"));

// FileObj.create("../site/static/data/" + "test" + ".js", "var modules1= " + JSON.stringify(Dir.toJson("../code/dropdown"), null, 2));
Init();