var fs = require("fs");
var Obj = require("./object.js");
var Path = require("path");
var FileObj = require("./file.js");
var Parse = require("./parse.js");
var Dir = require("./dir.js");

function parse(obj, parentPath, parentObj){
    
    //第一次
    if(parentPath == undefined){
        parentPath = "";
    }

    if(parentObj == undefined){
        parentObj = obj;
    }

    for(var path in obj){
        if(typeof obj[path] == "object"){
            
            obj[path] = parse(obj[path], Path.join(parentPath, path), obj);
            continue 
        }
        
        if(path.indexOf(".css") != -1 || path.indexOf(".scss") != -1){
            //将scss转化为css;
            if(path.indexOf(".scss") != -1){
                
                obj[path] = inCludeAndBase64(obj[path], parentPath, parentObj);

                var sass = require("node-sass");
                var result = sass.renderSync({
                    data: obj[path]
                }); 
                                
                obj[path] = typeof result == "object" ? result["css"].toString() : obj[path];
                //对嵌套和图片进行处理;

            }

            //将图片进行base64;
            // obj[path] = imageToBase64(obj[path], name);
        }
    }
    return obj;
}

//获取到CSS文件所有URL链接的图片，然后将图片替换为为base64字符串;
function inCludeAndBase64(code, parentPath, obj) {
    //如果code等于undefined或者null,直接返回为空
    if (!code) {
      return "";
    }
  
    var cssArr = code.split("{");  
    var urlPatten = /url\((.)*\)/gi;
    
    //获取选择器之前的内容
    var head = cssArr[0],
    headArr = head.split(";");

    //合成import的文件
    for(var x = 0; x < headArr.length; x++){
        
        var includeFilePath = Parse.getPathFromCode(headArr[x]);        
        if(includeFilePath == undefined){
            continue;
        }

        includeFilePath = Path.join(parentPath, includeFilePath);

        var includeParentPath = Dir.getDirOfPath(includeFilePath),
        includeCode = Obj.getContentFromPath(includeFilePath, obj);
        
        headArr[x] = inCludeAndBase64(includeCode, includeParentPath, Obj);
        // console.log("headArr", Parse.getPathFromCode(headArr[x]));
    }

    cssArr[0] = headArr.join(""); 

    //将查找图片
    for (var i = 1; i < cssArr.length; i++) {
        var imgArr = cssArr[i].match(urlPatten);
        
        if (!imgArr || imgArr.length == 0) {
            continue;
        }
  
        //获取图片Url
        var imgUrl = imgArr[0],
        startPos = imgUrl.indexOf("("),
        endPos = imgUrl.indexOf(")");

        var fileName = imgUrl.substr(startPos + 1, endPos - startPos - 1);

        var fileUrl = Path.join(parentPath, fileName);
        var fileContent = Obj.getContentFromPath(fileUrl, obj);                
            
        if(FileObj.isImage(fileName) == false){
            // console.log("fileName", cssArr[i]);
            cssArr[i] = fileContent;
            continue;
        }
        
    
        cssArr[i] = cssArr[i].replace(
            urlPatten,
            "url(" + fileContent + ")"
        );
        // console.log("img", imgName);
    }
    code = cssArr.join("{");
    return code;
}

module.exports = {
    parse: parse
}