var Path = require("path");
var FileObj = require("./file.js");
var Obj = require("./object.js")
var fs = require("fs");

//获取模块的入口文件
function parseModule(path, moduleJSON){    
    //所有文件存储对象
    var obj = {};

    //设置模块所在的根目录;
    // var basePath =  __dirname + "/../code/";
    // var modulePath = basePath + name;
    var modulePath = path;
    
    //找到模块的入口文件
    var packagePath = "./package.json";
    var package = setFileUsed(packagePath, moduleJSON);
    package = JSON.parse(package);

    // var packagePath = modulePath + "/" + "package.json";
    // var package = JSON.parse(FileObj.read(packagePath));

    // console.log("obj", Obj.getFromPath(packagePath, moduleJSON));
    //获取path;
    
    //获取入口文件
    var entryPath = package["main"];
    entryContent = setFileUsed(entryPath, moduleJSON);
    
    
    // var entryPath = modulePath + "/" + entry;
    
    // var entryContent = FileObj.read(entryPath);
    // obj[entry] = entryContent;
    
    //获取readme文档
    // var readmePath = modulePath + "/" + "readme.md";
    // if(FileObj.isExit(readmePath)){
    //     // obj["readme"] = FileObj.read(readmePath);
    // }

    // var fileObj = parseFile(entryContent, Path.dirname(entryPath), moduleJSON); 
    parseFile(entryContent, Path.dirname(entryPath), moduleJSON); 
    
    console.log("moduleJSON", moduleJSON);

    //将文件对象复制存储对象中
    // obj = contactObj(obj, fileObj);

    //将css引用的图片替换为base64
    // for(var path in obj){
    //     if(path.indexOf(".css") != -1 || path.indexOf(".scss") != -1){
    //         //将scss转化为css;
    //         if(path.indexOf(".scss") != -1){
                
    //             var sass = require("node-sass");
    //             var result = sass.renderSync({
    //                 data: obj[path],
    //             }); 
                                
    //             obj[path] = typeof result == "object" ? result["css"].toString() : obj[path];
    //         }

    //         //将图片进行base64;
    //         obj[path] = imageToBase64(obj[path], name);
    //     }
    // }

    // console.log("modules", obj);    
    return moduleJSON
}

/*
* 解析文件内容: 分析文件中import关键字并得到引用的文件路径; 根据文件路径读取文件内容并更新文件路径
*/
function parseFile(content, currPath, moduleJSON){    
    var obj = {};
    
    //将内容按”;"进行切分成每一行
    var lineArr = content.split(";");
    for(var i = 0; i < 5; i++){
        var code = lineArr[i];
        
        //过滤掉注释的代码
        if(code.indexOf("//") != -1){
            continue;
        }
        
        //去掉path上的双引号或者单引号
        var path = getPathFromCode(code);        
        if(typeof path == "string"){            
            path = path.replace(/"|'/g, "");
        }
            
        //判断路径状态
        if(path == undefined || path == "react" || path == "react-dom"){
            continue;
        }
        
        /*
            根据路径建立层级关系; 比如：将./a/b.js转化为下面格式
            {
                a: {
                    "b.js": null
                }
            }
        */
        console.log("path", path);
        
        // var curObj = obj;
        // var curFile = null;
            
        //判断最后一个值是否需要增加.js后缀; 比如将 ./A 转化为 ./A.js
        var pathArr = path.split("/");
        if((pathArr[0] == "." || pathArr[0] == "..") && pathArr.length > 1 && pathArr[pathArr.length - 1].indexOf(".") == -1){
            path = path + ".js";
        }
        path = pathArr.join("/");

    
        // for(var i = 0; i < pathArr.length; i++){
        //     var name = path[i];
        //     if(i == 0 && name == "."){
        //         continue;
        //     }
            
        //     //判断最后一个值是否需要增加.js后缀; 比如将 ./A 转化为 ./A.js
        //     if(i == pathArr.length - 1 && pathArr.length > 1 && path.indexOf(".js") == -1){
        //         name = name + ".js";
        //     }
            
        //     //
        //     if(name.indexOf(".") == -1) {
        //         curObj[name] = {};
        //         curObj = curObj[name];
        //     }else{
        //         curObj[name] = "";
        //         curFile = curObj[name];
        //     } 
        // }
        
        
        //依赖文件内容
        var importPath = Path.join(currPath, path);
        importContent = setFileUsed(importPath, moduleJSON)

        // var importContent = FileObj.read(importPath);
        // // obj[path] = importContent;
        // curFile = importContent
    
        //分析文件内容中import
        // var importObj = parseFile(importContent, Path.dirname(importPath));
        parseFile(importContent, Path.dirname(importPath), moduleJSON);
        
        // obj = contactObj(importObj, obj);
    }        

    return moduleJSON;
}

/*
*  获取文件名所在的路径；比如 node_modules/dropdown/lib/index.js => node_modules/dropdown/lib/
*/
function getPathFromCode(code){    
    var path;
    if(code.indexOf("import") != -1){
        var codeArr = code.split(" ");                 
        //最后一个数组是文件地址
        var length = codeArr.length;
        path = codeArr[length - 1];
    }else if(code.indexOf("require") != -1){
        var startPos = code.indexOf("("),
            endPos = code.indexOf(")");    
        
        path = code.substr(startPos + 1, endPos - startPos - 1);
        //
    }

    //去除path中的双引号和单引号
    return path;
}

//当文件被调用后，在文件Key之前增加一个$
function setFileUsed(path, moduleJSON){
    var parentObj = Obj.getParentFromPath(path, moduleJSON);    
    var fileName = FileObj.getName(path);

    if(parentObj[fileName] == undefined) {
        return;
    }
    
    var content = parentObj[fileName];
    var usedFileName = "$" + fileName; 

    parentObj[usedFileName] = content;
    delete parentObj[fileName];

    return content;

}   

module.exports = {
    module: parseModule,
      file: parseFile
}