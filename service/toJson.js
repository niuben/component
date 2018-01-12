var FileObj = require("./file.js");
var Path = require("path");
var Dir = require("./dir.js");
var Parse = require("./parse.js");
var Obj = require("./object.js");

//获取入口文件

//递归解析文件
function Init(){
    var basePath =  __dirname + "/../code/";
    var modulesArr = ["dropdown"];

    modulesArr.map(function(moduleName){
        var path = basePath + moduleName;
        var moduleJSON = Dir.toJSON(path);
                
        moduleJSON = Parse.module(moduleName, moduleJSON);
        moduleJSON = Obj.clear(moduleJSON);

        FileObj.create("../site/static/data/" + "test" + ".js", JSON.stringify(moduleJSON, null, 2));
    });
}


//合并路径 /a/b + ../c => /a/c 
function contactPath(path, curPath){    
    return Path.join(path, curPath);
}


var a = {
    a: {
        "b.js": "123123123"
    },
    c: {
        "d.js": "23232323",
        e: {
            "g.js": "23232323111"
        }
    }
}

// console.log(clearObj(a));
// console.log(contactPath("/a/b", "../c"));
// console.log(getObjFromPath("./c/e/g.js", a));
// console.log(Dir.toJson("../code/dropdown"));

// FileObj.create("../site/static/data/" + "test" + ".js", "var modules1= " + JSON.stringify(Dir.toJson("../code/dropdown"), null, 2));
Init();
