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
var Component = require("./component.js");
var argv = require("optimist").argv;
var Template = require("./template.js");
var Marked = require("marked");

//递归解析文件
function Init(){
    var moduleListArr = Component.getList();    
    var modulesArr = Component.getListName(moduleListArr);
    
    var list = []
    moduleListArr.map(function(curModule){
        list.push({
            url: Path.join(paths.detailDist, curModule["name"],  curModule["name"] + ".html"),
            name: curModule["name"]
        });
    });
    Template.index(list);
    console.log("首页生成完毕");    

    modulesArr.map(function(moduleName, index){
        if(fs.existsSync(Path.join(paths.code, moduleName))){
            create([moduleName], [moduleListArr[index]]);
        }else {
            Component.download(modulesArr, function(){
                create([moduleName], [moduleListArr[index]]);
            })
        }
    })

    
}


function create(modulesArr, moduleListArr){
    
    // var basePath =  __dirname + "/../code/";
    var basePath = paths.code;
    // var modulesArr = ["react-viewport-slider"];
    // var modulesArr = ["stepbar"];

    modulesArr.map(function(moduleName, index){        

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

                Template.detail(moduleName, markdown);                

                //创建预览页
                var example = moduleListArr[index]["example"],
                    htmlPath = example["html"],
                    jsPath = example["js"];
                
                // htmlPath = Path.join(paths["code"], moduleName, htmlPath);
                jsPath = Path.join(paths["code"], moduleName, jsPath);
                
                var htmlTpl = example["html"],
                    jsTpl = FileObj.read(jsPath);

                Template.preview(moduleName, htmlTpl, jsTpl);
                console.log(moduleName, "页生成完毕");
                
            });
        })
    });
}

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