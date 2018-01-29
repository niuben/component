// var JSON = require("json");
var fs = require('fs');
var jsdom = require("jsdom");
var md = require("node-markdown").Markdown;
var md5 = require("md5");

var template = require("underscore.template");


function createFile(path, content){    
    return fs.writeFileSync(path, content);
};

function readFile(path) {
    var buf = fs.readFileSync(path);
    return buf.toString();
}

function getFileType(fileName) {
    var fileNameArr = fileName.split('.');
    return fileNameArr[fileNameArr.length - 1];
}

function getFileName(path){
    var pathArr = path.split('/');
    return pathArr[pathArr.length - 1];
}

function getMDTitle(path) {
    var content = fs.readFileSync(path).toString();
    if(content.length == 0) {
        return null;
    }
    var dom = new jsdom.JSDOM(md(content));
    var document = dom.window.document;
    return document.body.childNodes[0].innerHTML;
}

//搜索文件
function searchFile(fileName, fileObj) {
    var arr = fileObj.files;
    for(var i = 0; i < arr.length - 1; i++){
        if(arr[i]["name"].toLocaleLowerCase() == fileName.toLocaleLowerCase()){
            return arr[i]["content"];
        }
        if(typeof arr[i]["files"] == "object"){
            return searchFile(fileName, arr[i]);
        }
    }
    return;
}
/*
* 遍历文件夹生成JSON文件;
* {
    name: "components",
    files: [{
        name: "Tab",
        title: "Tab",
        files: [
            "index.css", "readme.md", {
                    name: "images",
                    files: ["index.png", {
                        name: "src",
                        files: ["iamge.png", "1.png"]
                    }]
                }]
            }
        ]
    },{
        
        title: "menu",
        files: [
            "index.css", "readme.md"
        ]
    }]
}
*/
function getJSONByDir(path){
    // var titleArr = [];
    var fileName = getFileName(path);
    var fileObj = {
        name: getFileName(path),
        path: path,
        files: [],
        url: md5(fileName)
    };
    
    var files = fs.readdirSync(path);
    files.forEach(function(file){
        var pathName = path + "/" + file;
        var stat = fs.lstatSync(pathName);
        
        //屏蔽"."开头的文件夹
        if(file.indexOf(".") == 0) {
            return;
        }

        if(stat.isDirectory()){            
            if( file == "example" || file == "examples"){
                fileObj["demo"] = "." + pathName + "/index.html";
            }
            fileObj["files"].push(getJSONByDir(pathName));
        }else {  
            var content = readFile(pathName);           
            if( getFileType(file) == "md"){
                var title = getMDTitle(pathName);
                fileObj["title"] = title;
                fileObj["url"] = md5(title);
                //将Markdown转换为HTML
                content = md(content); 
            }
            fileObj["files"].push({
                name: file,
                content: encodeURIComponent(content)
            });
            
            // fileObj["contents"].push({
            //     pathName: readFile(pathName)
            // })
        }
    });
    return fileObj;
};

// console.log(JSON.stringify(json));
// createFile("file.json", JSON.stringify(json));

var rmdir = function(directories, callback) {
    var child = require('child_process');    
    if(typeof directories === 'string') {
        directories = [directories];
    }
    var args = directories;
    args.unshift('-rf');
    child.execFile('rm', args, {env:process.env}, function(err, stdout, stderr) {
        callback && callback.apply(this, arguments);
    });
}

//清空文件夹
function clearDir(path){
    rmdir(path, function(){
        fs.mkdirSync(path);
    });
}

//创建首页
function createIndexPage(json){
    var content = readFile("./index.html");    
    var dom = new jsdom.JSDOM(content);
    var document = dom.window.document;
    
    var listTpl = document.getElementById("model");
    
    //创建列表    
    var files = json.files;
    files.map(function(item){
        
        //设置预览地址
        var firstHTMLPath = getFirstHTML(item["files"], item["path"]);
        listTpl.content.querySelector("iframe").src = "." + firstHTMLPath;
        
        //设置详情页链接和标题
        listTpl.content.querySelector("a").href = "/dist/" + item["url"] + ".html";
        listTpl.content.querySelector(".tt").innerHTML = item.title || item.name;

        document.querySelectorAll(".content")[1].appendChild(document.importNode(listTpl.content, true));        
    })
    createFile("./dist/index.html", document.getElementsByTagName("html")[0].outerHTML);
};

//得到初始HTML
function getFirstHTML(fileArr, path){
    
    //查找HTML的文件
    for (var i = 0; i < fileArr.length; i++) {
        var file = fileArr[i];

        //文件
        if(file["files"] == undefined && file["name"] !== undefined  && getFileType(file["name"]) == "html"){
            return path + "/" + file["name"];
        }
        
        //文件夹
        if(file["files"] !== undefined) {
            var newFileArr = file.files;
            var newPath = path + "/" + file["name"];
            
            var htmlPath = getFirstHTML(newFileArr, newPath);
            if(htmlPath != undefined) {
                return htmlPath;
            }    
        }
    }
    return;
}

//获得每个文件的内容
function getFilesContent(fileArr, path, root){
    var contentArr = [];
    for (var i = 0; i < fileArr.length; i++) {
        var file = fileArr[i];               
        if(typeof file == "string") {
            var newPath = path + "/" + file;
            //去掉路径中根目录相同的部分
            var content = readFile(newPath);
            newPath = newPath.substr(root.length + 1, newPath.length);            
            
            contentArr.push({
                name: newPath,
                // content: encodeURIComponent(content)
                content: content
            });
        }

        if(typeof file == "object") {
            var newFileArr = file.files;
            var newPath = path + "/" + file["name"];                
            contentArr.push({
                name: newPath,
                files: getFilesContent(newFileArr, newPath, root),
            });

        }
    }
    return contentArr;
}

//创建列表页
function createDetailPage(json) {
    var content = readFile("./do.html");    
    var document = dom.window.document;

    var files = json.files;    
    files.map(function(item, index){
        var path = item["path"];
        
        //获取第一个HTML地址,并写入初始预览HTML路径
        var markdown = searchFile("readme.md", item); 
        var firstHTMLPath = getFirstHTML(item["files"], item["path"]);

        var tplObj = {
            
            title: item["title"] || item["name"], //组件名称
            markdown: decodeURIComponent(markdown), //Makadown内容 
            config: "var config = " + JSON.stringify(item), //数据配置 
            src:  "." + firstHTMLPath//初始组件预览            
        };
        
        var doTpl = template(readFile("./do.html"));
        // console.log("tpl", doTpl({value: "hello world"}));
        createFile("./dist/" + item["url"] + ".html", doTpl(tplObj));
    });

}

// clearDir("./dist");
// var json = getJSONByDir("./components");

// console.log(JSON.stringify(json));

// createIndexPage(json);
// createDetailPage(json);
module.exports = {
    create: createFile,
    read: readFile,
    getType: getFileType
}