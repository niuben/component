var Path = require("path");
var FileObj = require("./file.js");

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

    var fileObj = parseFile(entryContent, Path.dirname(entryPath)); 
    
    //将文件对象复制存储对象中
    obj = contactObj(obj, fileObj);

    console.log("modules", obj);
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
        
        //依赖文件内容
        var importPath = Path.join(currPath, path);
        var importContent = FileObj.read(importPath);

        obj[path] = importContent;

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
    }

    //去除path中的双引号和单引号
    return path;
}

var fileJSON = parseModule("range-select");
FileObj.create("../site/static/data/range-select.json", JSON.stringify(fileJSON));
// console.log(Path.join(getPathFromCode("node_modules/dropdown/lib/index.js"), "b.js"));