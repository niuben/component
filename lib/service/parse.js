var Path = require("path");
var FileObj = require("./file.js");
var Obj = require("./object.js")
var fs = require("fs");

var libArr = [];
//获取模块的入口文件
function parseModule(path, moduleJSON, confJSON){    
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
    
    libArr = [];

    //获取入口文件
    var entryPath = package["main"];
    entryContent = setFileUsed(entryPath, moduleJSON);
    parseFile(entryContent, Path.dirname(entryPath), moduleJSON); 

    //获取DEMO JS文件依赖的库文件
    var demoPath = confJSON["example"] ? ( confJSON["example"]["js"] ? confJSON["example"]["js"] : null ) : null;
    if(demoPath){
        var demoContent = setFileUsed(demoPath, moduleJSON);
        console.log(demoContent);
        parseFile(demoContent, Path.dirname(demoPath), moduleJSON);         
    }

    // var entryPath = modulePath + "/" + entry;
    
    // var entryContent = FileObj.read(entryPath);
    // obj[entry] = entryContent;
    
    //获取readme文档
    // var readmePath = modulePath + "/" + "readme.md";
    // if(FileObj.isExit(readmePath)){
    //     // obj["readme"] = FileObj.read(readmePath);
    // }

    // var fileObj = parseFile(entryContent, Path.dirname(entryPath), moduleJSON); 
    
    //实例中代码也会用到库文件    


    //给库文件增加版本号
    var newLibObj = {};
    var checkList = ["peerDependencies", "dependencies", "devDependencies"];
    libArr.push("rc-util");
    
    libArr.map(function(libName){
        
        if(libName == "rc-select"){
            return;
        }

        var version = null;
        checkList.map(function(key){
            if(package[key] == undefined){
                return false;
            }
                        
            if(package[key][libName] != undefined){
                version = package[key][libName];
            }
        });
        
        newLibObj[libName] = version;
        // obj[libName] = version;
        // newLibArr.push(obj);
    });

    // console.log("moduleJSON", moduleJSON);

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
    return{ 
        module: moduleJSON,
        lib: newLibObj,
        entry: entryPath
    }
}

/*
* 解析文件内容: 分析文件中import关键字并得到引用的文件路径; 根据文件路径读取文件内容并更新文件路径
*/
function parseFile(content, currPath, moduleJSON){    
    var obj = {};
    
    if(!content){
        return moduleJSON;
    }

    //将内容按”;"进行切分成每一行
    var lineArr = content.split(";");
    for(var i = 0; i < lineArr.length; i++){
        var code = lineArr[i];
        
        //过滤掉注释的代码
        if(code.indexOf("//") != -1){
            continue;
        }
        
        //去掉path上的双引号或者单引号
        var result = getPathFromCode(code);        
        var pathList = [];

        if(typeof result == "string"){
            pathList.push(result);
        }else if(typeof result == "object" && result != null){
            pathList = pathList.concat(result);
        }

        // if(typeof result == "string"){            
        //     result = result.replace(/"|'/g, "");
        //     pathList = [result];
        // }else if(typeof result == "object" && result != null){
        for(var x = 0; x < pathList.length; x++){
            if(typeof pathList[i] == "string"){
                pathList[i] = pathList[i].replace(/"|'/g, "");
            }
        }
            // pathList = pathList.concat(result);
        // }
        
        pathList.map(function(path){
            //判断路径状态
            if(path == undefined || (path.indexOf(".") == -1 && path.indexOf("/") == -1)){
                if(path && libArr.indexOf(path) == -1){                                
                    libArr.push(path);
                }

                //当时React时则增加react-dom
                if(path == "react"){
                    libArr.push("react-dom");
                }
                return;
            }
            
            //将./A/ 转换为./A/index.js
            if(typeof path == "string" && path.charAt(path.length - 1) == "/" && path.length > 0){
                path += "index.js";
            }

            //判断最后一个值是否需要增加.js后缀; 比如将 ./A 转化为 ./A.js
            var pathArr = path.split("/");
            // if((pathArr[0] == "." || pathArr[0] == "..") && pathArr.length > 1 && pathArr[pathArr.length - 1].indexOf(".") == -1){
            //     path = path + ".js";
            // }            
            console.log("path", path);

            //依赖文件内容
            var importPath = Path.join(currPath, path);
            importContent = setFileUsed(importPath, moduleJSON)
            parseFile(importContent, Path.dirname(importPath), moduleJSON);
        })        
        // obj = contactObj(importObj, obj);
    }        

    return moduleJSON;
}

/*
*  获取文件名所在的路径；比如 node_modules/dropdown/lib/index.js => node_modules/dropdown/lib/
*/
function getPathFromCode(code){    
    var result;
    if(code.indexOf("import") != -1){
        var codeArr = code.split(" ");                 
        //最后一个数组是文件地址
        var length = codeArr.length;
        result = codeArr[length - 1];
    }else if(code.indexOf("require") != -1){
        result = code.match(/require\(([^)]+)\)/g);
        if(typeof result == "object" && result != null){
            for(var i = 0; i < result.length; i++){
                var startPos = result[i].indexOf("("),
                    endPos = result[i].indexOf(")");    
                result[i] = result[i].substr(startPos + 1, endPos - startPos - 1);
            }
        }

    }

    //去除path中的双引号和单引号
    if(typeof result == "string"){
        result = result.replace(/"|'/g, "");
    }if(typeof result == "object" && result != null){
        for(var i = 0; i < result.length; i++){
            result[i] = result[i].replace(/"|'/g, "");
        }
    }

    return result;
}

//获取到CSS文件所有URL链接的图片，然后将图片替换为为base64字符串;
function parseCss(code, path, moduleJSON) {
    //如果code等于undefined或者null,直接返回为空
    if (!code) {
      return "";
    }
  
    var cssArr = code.split("{");
  
    var urlPatten = /url\((.)*\)/gi;
    var imgBasePath = Path.join("../code/", componentName, "/lib/");
  
    //文件名设定为组件名
    // var componentName = getFileName(path);
  
    //将查找图片
    for (var i = 0; i < cssArr.length; i++) {
        var imgArr = cssArr[i].match(urlPatten);
        
        if (!imgArr || imgArr.length == 0) {
            continue;
        }
  
        //获取图片Url
        var imgUrl = imgArr[0],
        startPos = imgUrl.indexOf("("),
        endPos = imgUrl.indexOf(")");

        var imgName = imgUrl.substr(startPos + 1, endPos - startPos - 1);

        if(isImage(imgName) == false){
            console.log(imgName);
            continue;
        }
        
        var imgFileUrl = Path.join(imgBasePath, imgName);
        var imgContent = fs.readFileSync(imgFileUrl);
        var imgBase64 = "data:image/png;base64," +  new Buffer(imgContent).toString("base64");

        cssArr[i] = cssArr[i].replace(
            urlPatten,
            "url(" + imgBase64 + ")"
        );
        // console.log("img", imgName);
    }
    code = cssArr.join("{");
    return code;
}


//当文件被调用后，在文件Key之前增加一个$
function setFileUsed(path, moduleJSON){
    var parentObj = Obj.getParentFromPath(path, moduleJSON);    
    var fileName = FileObj.getName(path);

    
    if(parentObj[fileName] == undefined && fileName.indexOf(".") != -1) {
        return;
    }

    //有些引用是没有文件后缀名，比如./A/B。B有可能是JS文件还可能是JSX文件
    if(fileName.indexOf(".") == -1){
        for(var key in parentObj){            
            if(key.indexOf(".") != -1 && key.split(".")[0] == fileName){
                fileName = key;
            }
        }
    }
                
    var content = parentObj[fileName];
    var usedFileName = "$" + fileName; 

    parentObj[usedFileName] = content;
    delete parentObj[fileName];

    return content;

}   

function getPackage(){

}

// //得到入口文件
// function getEntry(path){
    
//     var modulePath = path;
    
//     //找到模块的入口文件
//     var packagePath = "./package.json";
//     var package = setFileUsed(packagePath, moduleJSON);
//     package = JSON.parse(package);

//     //获取入口文件
//     var entryPath = package["main"];    
//     return entryPath;
// }


module.exports = {
             module: parseModule,
               file: parseFile,
    getPathFromCode: getPathFromCode
}