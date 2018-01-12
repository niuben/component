var Path = require("path");
var FileObj = require("./file.js");
var fs = require("fs");

//获取模块的入口文件
function parseModule(name){    
    //所有文件存储对象
    var obj = {};

    //设置模块所在的根目录;
    var basePath =  __dirname + "/../code/";
    var modulePath = basePath + name;

    //找到模块的入口文件
    var packagePath = modulePath + "/" + "package.json";
    var package = JSON.parse(FileObj.read(packagePath));

    //获取入口文件
    var entry = package["main"];
    var entryPath = modulePath + "/" + entry;
    var entryContent = FileObj.read(entryPath);
    obj[entry] = entryContent;

    //获取readme文档
    var readmePath = modulePath + "/" + "readme.md";
    if(FileObj.isExit(readmePath)){
        obj["readme"] = FileObj.read(readmePath);
    }

    var fileObj = parseFile(entryContent, Path.dirname(entryPath)); 
    
    //将文件对象复制存储对象中
    obj = contactObj(obj, fileObj);

    //将css引用的图片替换为base64
    for(var path in obj){
        if(path.indexOf(".css") != -1 || path.indexOf(".scss") != -1){
            //将scss转化为css;
            if(path.indexOf(".scss") != -1){
                
                var sass = require("node-sass");
                var result = sass.renderSync({
                    data: obj[path],

                }); 
                                
                obj[path] = typeof result == "object" ? result["css"].toString() : obj[path];
            }

            //将图片进行base64;
            obj[path] = imageToBase64(obj[path], name);
        }
    }

    // console.log("modules", obj);    
    return obj;
}

/*
* 解析文件内容: 分析文件中import关键字并得到引用的文件路径; 根据文件路径读取文件内容并更新文件路径
*/
function parseFile(content, currPath){    
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
        * 根据路径建立层级关系; 比如：将./a/b.js转化为下面格式
        {
            a: {
                "b.js": null
            }
        }
        */        
        console.log("path", path);
        
        var curObj = obj;
        var curFile = null;
        pathArr = path.split("/");
        for(var i = 0; i < pathArr.length; i++){
            var name = path[i];
            if(i == 0 && name == "."){
                continue;
            }
            
            //判断最后一个值是否需要增加.js后缀; 比如将 ./A 转化为 ./A.js
            if(i == pathArr.length - 1 && pathArr.length > 1 && path.indexOf(".js") == -1){
                name = name + ".js";
            }
            
            //
            if(name.indexOf(".") == -1) {
                curObj[name] = {};
                curObj = curObj[name];
            }else{
                curObj[name] = "";
                curFile = curObj[name];
            }

        }

        path = pathArr.join("/");
        
        //依赖文件内容
        var importPath = Path.join(currPath, path);
        var importContent = FileObj.read(importPath);
        // obj[path] = importContent;
        curFile = importContent
    
        //分析文件内容中import
        var importObj = parseFile(importContent, Path.dirname(importPath));
        
        obj = contactObj(importObj, obj);
    }        

    return obj;
}

//将两个对象进行合并然后返回一个合并后的对象
function contactObj(obj, obj1){
    var newObj = {}
    for(var x in obj){
        newObj[x] = obj[x];
    }
    for(var y in obj1){
        newObj[y] = obj1[y];
    }    
    return newObj;
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

function isImage(imgName){
    if(imgName.indexOf(".") == -1){
        return false;
    }

    var imgNameArr = imgName.split(".");
    var imgType = imgNameArr[imgNameArr.length - 1];
    var imgTypeList = ["png", "jpg", "jpeg", "gif", "bmp"];
    
    imgType = imgType.toLowerCase();

    if(imgTypeList.indexOf(imgType) == -1){
        return false;
    }
    return true;
}   

//获取到CSS文件所有URL链接的图片，然后将图片替换为为base64字符串;
function imageToBase64(code, componentName) {
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

//获取到CSS文件所有URL链接的图片，然后将图片替换为为base64字符串;
function imageToBase64(code, componentName) {
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

// var modulesArr = ["dropdown", "stepbar", "group-button-sort"];
var modulesArr = ["react-viewport-slider"];
modulesArr.map(function(moduleName){
    var module = {
        component: [{
            id: "1",
            name: moduleName,
            file: {}
        }]
    }
    var fileJSON = parseModule(moduleName);
    console.log("fileJSON", fileJSON);
    module["component"][0]["file"] = fileJSON;    
    FileObj.create("../site/static/data/" + moduleName + ".js", "var modules1= " + JSON.stringify(module, null, 2));
});
// console.log(Path.join(getPathFromCode("node_modules/dropdown/lib/index.js"), "b.js"));