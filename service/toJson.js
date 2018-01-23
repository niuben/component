var request = require("request");
var FileObj = require("./file.js");
var Path = require("path");
var Dir = require("./dir.js");
var Parse = require("./parse.js");
var Obj = require("./object.js");
var fs = require("fs");
var Sass = require("./sass.js");
var dll = require("./dll.js");
var paths = require("./paths.js");

//递归解析文件
function Init(){

    var basePath =  __dirname + "/../code/";
    var modulesArr = ["react-viewport-slider"];
    // var modulesArr = ["stepbar"];

    modulesArr.map(function(moduleName){
        var path = basePath + moduleName;
        var fileJSON = Dir.toJSON(path);
                
        moduleJSON = Parse.module(moduleName, fileJSON);
                
        moduleJSON["module"] = Obj.clear(moduleJSON["module"]);
        moduleJSON["module"] = Sass.parse(moduleJSON["module"]);
        
        // FileObj.create("../site/static/data/" + "test" + ".js", "var modules=" + JSON.stringify(moduleJSON));

        // var baseUrl = "https://webpack-dll-prod.herokuapp.com/v6/";
        var libList = moduleJSON["lib"];                
        // for(var lib in libList){
        //   baseUrl += lib + "@" + libList[lib] + "+";
        // }
        // baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        
        // var url = "https://webpack-dll-prod.herokuapp.com/v6/react@16.0.0+react-dom@16.0.0+react-router-dom@4.2.2/dll.js";
        // var manifest = "https://webpack-dll-prod.herokuapp.com/v6/react@16.0.0+react-dom@16.0.0+react-router-dom@4.2.2/manifest.json"
        // // request(url, function(err, response, body){
            
        // //     console.log("body", body);
        // // });

        // console.log("baseUrl", baseUrl + "/manifest.json");

        // request(baseUrl + "/dll.js").pipe(fs.createWriteStream("../site/static/data/lib.js"));
        // request(baseUrl + "/manifest.json").pipe(fs.createWriteStream("../site/static/data/manifest.js"));        
        // request(baseUrl + "/manifest.json", function(msg, response, body){
        //     // console.log(typeof body);
        //     var manifest = {};
        //     try{
        //         // manifest = JSON.parse(body);
        //         moduleJSON["manifest"] = manifest;  
        //         FileObj.create("../site/static/data/" + "test" + ".js", "var modules=" + JSON.stringify(moduleJSON));
        //     }catch(e){
        //         console.log(e);
        //     }

        //     // if(typeof body == "object"){
        //     //     console.log("body");
        //     // }            
        //     // FileObj.create("../site/static/data/" + "test" + ".js", "var modules=" + JSON.stringify(moduleJSON));
        // });                
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

            dll.create(libList, ()=>{
                var manifest = FileObj.read(Path.join(paths["dist"], "manifest.json"));                
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
                FileObj.create("../site/static/data/" + moduleName +  ".js", "var modules=" + JSON.stringify(moduleJSON));

            });
        })
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