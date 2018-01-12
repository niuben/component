
var request = require("request");
var FileObj = require("./file.js");
var Path = require("path");
var Dir = require("./dir.js");
var Parse = require("./parse.js");
var Obj = require("./object.js");
var fs = require("fs");

//获取入口文件

//递归解析文件
function Init(){

    var basePath =  __dirname + "/../code/";
    var modulesArr = ["react-viewport-slider"];

    modulesArr.map(function(moduleName){
        var path = basePath + moduleName;
        var fileJSON = Dir.toJSON(path);
                
        moduleJSON = Parse.module(moduleName, fileJSON);
        moduleJSON["module"] = Obj.clear(moduleJSON["module"]);
        

        var baseUrl = "https://webpack-dll-prod.herokuapp.com/v6/";
        var libList = moduleJSON["lib"];
        for(var lib in libList){
          baseUrl += lib + "@" + libList[lib] + "+";    
        }
        baseUrl = baseUrl.substr(0, baseUrl.length - 1);

        

        // var url = "https://webpack-dll-prod.herokuapp.com/v6/react@16.0.0+react-dom@16.0.0+react-router-dom@4.2.2/dll.js";
        // var manifest = "https://webpack-dll-prod.herokuapp.com/v6/react@16.0.0+react-dom@16.0.0+react-router-dom@4.2.2/manifest.json"
        // // request(url, function(err, response, body){
            
        // //     console.log("body", body);
        // // });
        request(baseUrl + "/dll.js").pipe(fs.createWriteStream("../site/static/data/lib.js"));
        request(baseUrl + "/manifest.json").pipe(fs.createWriteStream("../site/static/data/manifest.js"));
        
        // FileObj.create("../site/static/data/" + "test" + ".js", FileObj.read(url));
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
