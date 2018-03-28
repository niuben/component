const prompts = require('prompts');
const git = require("simple-git/promise");
const paths = require("../paths.js");
const path = require("path");
const FileObj = require("../file.js");
const fs = require("fs");
const rimraf = require("rimraf");
const Dir = require("../dir.js"); 
const Bundle = require("../bundle.js");
const Config = require("./config.js");
const {exec} = require("child_process");
const Template = require("../template.js");
const Copy = require("../copy.js");
const Screenshot = require("../screenshot.js");
var Marked = require("marked");
var os = require("os");

function searchArrObj(arr, key,val) {
    var isHave = 0;
    for(var i = 0; i < arr.length - 1; i++){
        if(arr[i][key] == val){
            return arr[i];
        }
    }
    return false;
}

async function command(){
    var moduleName, localPath;
    var config = [{
            type: 'text',
            name: 'git',
            message: '输入组件地址git地址',
            initial: ""
        },{        
            type: function(git){
                // console.log(git);
                moduleName = path.parse(git)["name"];                
                if(moduleName.indexOf(".git") != -1){
                    var moduleNameArr = moduleName.split(".");
                    moduleName = moduleNameArr[0];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                }            
                localPath = path.join(paths["source"], moduleName); 

                if(FileObj.isExit(localPath)){
                    return "toggle"
                }
                return null
            },
            name: 'isCover',
            message: '组件已存在,是否重新下载?',
            initial: false,
            active: "是",
            inactive: "否" 
        },{
            type: async function(prev, prevs){
            if(FileObj.isExit(localPath) == false || prev == true){
                if(FileObj.isExit(localPath)){
                    rimraf.sync(localPath);
                }
                console.log("组件下载中...");
                await git().clone(prevs["git"], localPath);
                console.log("组件下载完成~");                
            }
                                    
            var packagePath = path.join(localPath, "./package.json");                        
            var package = {};
            if(FileObj.isExit(packagePath)){
                package = JSON.parse(FileObj.read(packagePath));                    
            }                        
                      
            //版本号
            var version = "";    
            if(package["version"]){
                var versionObj = searchArrObj(config, "name", "version");
                versionObj["initial"] = package["version"];
            }

            //组件描述
            var content = "";    
            if(package["description"]){
                var contentObj = searchArrObj(config, "name", "description");
                contentObj["initial"] = package["description"];
            }
            
            return "text";
        },
            name: 'version',
            message: '组件版本号',
            initial: ""
        },{
            type: 'text',
            name: 'description',
            message: '组件描述',
            initial: ""
        },{
            type: 'select',
            name: 'browser',
            message: '选择组件兼容浏览器',
            choices: [{
                title: "IE6及以上",
                value: "ie6"
            },{
                title: "IE7及以上",
                value: "ie7"
            },{
                title: "IE8及以上",
                value: "ie8"
            },{
                title: "IE9及以上",
                value: "ie9"
            },{
                title: "IE10及以上",
                value: "ie10"
            },{
                title: "IE11及以上",
                value: "ie11"
        }],
        hint: '选择某个浏览器，证明支持比它版本高浏览器'
    },{
        type: "select",
        name: "type",
        message: "选择演示类型",
        choices: [{
            title: "输入线上地址",
            value: 3
        },{
            title: "选择资源文件夹（已打包）",
            value: 1
        },{
            title: "选择入口JS文件（未打包）",
            value: 2
        }]
    },{
        type: function(prev){
            if(prev == 3){
                return "text";
            }
            return null;
        },
        name: "url",
        message: "输入线上地址"
    }]    
        
    var resultObj = await prompts(config);
    //输入框Git地址   
    //选择事例项目代码目录
    var json = Dir.toJSON(localPath);
    var prevDir = json;
    var prevPath = "./";        
    async function selectDir(dirObj, _path, message, isChooseFile, isMulti){        
        
        if(_path == "./"){
            prevDir = json;
            prevPath = "./";
        }

        var choices = _path == "./" ? [] : [{
            title: "上一层",
            value: "~"
        }];

        for(var name in dirObj){
            choices.push({
                title: name,
                value: name
            });                
        }        
        
        // console.log("choices", choices);
        // FileObj.create(path.join(paths["dist"], "choices.json"), JSON.stringify(choices));
        var response = await prompts({
            type: isMulti == false ? 'select' : "multiselect",
            name: 'demo',
            message: message,
            choices: choices
        });

        // console.log("response", response);            
        var choose = response["demo"];
        var curDir;
        if(choose != "~"){
            for(var name in dirObj){
                if(choose == name){
                    curDir = dirObj[name];                
                    prevDir = dirObj;
                    prevPath = _path;
                    break;
                }
            }
        }else{
            curDir = prevDir;
        }
        
        if(isMulti == false){
            if(typeof curDir == "object"){            
                _path = choose != "~" ? _path + choose + "/" : prevPath;
                console.log("当前文件路径:", _path);            
                
                if(isChooseFile == true){
                    return selectDir(curDir, _path, message, isChooseFile, isMulti);
                }
            }else {
                _path += choose;
            }
        }else{
            return choose;
        }
                       
        return _path;
    }
    
    if(resultObj["type"] == 1){
        resultObj["demo"] =  await selectDir(json, "./", "选择资源文件夹", false, true);        
        resultObj["html"] = await selectDir(json, "./", "选择演示HTML地址", true, false);    
    }else if(resultObj["type"] == 2) {
        resultObj["entry"] =  await selectDir(json, "./", "选择入口JS文件", true, false);    
        resultObj["html"] = await selectDir(json, "./", "选择演示HTML地址", true, false);        
    }
    
    resultObj["name"] = moduleName;    
    
    //Markdown转化            
    var markdownPath = path.join(localPath, "readme.md");
    markdownPath = FileObj.isExit(markdownPath) ?  markdownPath : path.join(localPath, "README.md")
    
    if(FileObj.isExit(markdownPath)){
        markdown = FileObj.read(markdownPath);        
        resultObj["markdown"] = Marked(markdown);
    }
    
    // console.log("resultObj", resultObj);
    return resultObj;
}

function isWindowns(){
    var system = os.type();
    if(system == "Windows_NT"){
        return true;
    }
    return false;
}

async function init(){ 
    
    var curModule = await command();
    var moduleName = curModule["name"];
    var fromPath = path.join(paths["source"], moduleName);    
    var toPath = path.join(paths["dist"], moduleName);    
    if(FileObj.isExit(toPath) == false){
        fs.mkdirSync(toPath);
    }

    //将演示代码目录拷贝到Dist下
    // var demoPath = Path.parse(curModule["demo"]);
    if(curModule["type"] == 1){
        if(typeof curModule["demo"] == "object"){
            curModule["demo"].map(function(fileName){
                if(fileName.indexOf(".") == -1){
                    Copy.dir(path.join(fromPath, fileName), path.join(toPath, fileName));
                }else{
                    Copy.file(path.join(fromPath, fileName), path.join(toPath, fileName));
                }
            })
        }        
    }else if(curModule["type"] == 2){
        Bundle.build(curModule);        
        // Template.preview(curModule);
    }

    // 设置访问地址
    if(curModule["type"] == 1){
        curModule["url"] = curModule["html"];
    }else if(curModule["type"] == 2){
        curModule["url"] = "./preview.html";
        Template.preview(curModule);
    }

    //拷贝入口文件
    if(typeof curModule["html"] == "string"){
        var html = curModule["html"];
        Copy.file(path.join(fromPath, html), path.join(toPath, html));
    }
    Template.detail(curModule);
        
    var url = curModule["url"];
    var dist = path.join(paths["dist"], moduleName, "preview.png");
    if(curModule["type"] != 3){
        url = "file://" + path.join(paths["dist"], moduleName, url);    
    }
    Screenshot.build(curModule["url"], dist, checkScreenShot);    
    
    //让用户检查截图是否正确;
    async function checkScreenShot(){

        var config = [{
            type: 'toggle',
            name: 'isCheckScreenshot',
            message: '是否检查截图？',
            initial: true,
            active: "是",
            inactive: "否"
        },{
            type: function(prev){                               
                if(prev == true){                    
                    var command = isWindowns() ? "explorer " + dist : "open file://" + dist;
                    exec(command, "", function(){
                        
                    });
                    return "toggle";
                }
                return null;
            },
            name: "isMatch",
            message: "截图是否正确?",
            active: "是",
            inactive: "否"    
        }];    
        var screenshotObj = await prompts(config);        
        if(screenshotObj["isCheckScreenshot"] == false || screenshotObj["isMatch"] == true){
            console.log("组件发布成功~");
         
        }else{    
            if(screenshotObj["isMatch"] == false){
                var command = isWindowns() ? "explorer " + url : "open " + url;
                exec(command);
                console.log("已经为你打开了网页，请手动截图并替换图片。替换地址：", dist);
            }
            
            var config = {
                type: "toggle",
                message: "是否已替换preview.png图片?",
                name: "isReplace",
                initial: true,
                active: "是",
                inactive: "否"                                                          
            }
            var confirmObj = await prompts(config);
            
            if(confirmObj["isReplace"] == true){
                console.log("组件发布成功~");
            }else{
                console.log("手动替换图片即可完成组件发布~ 替换地址:" + dist);
            }
        }
        FileObj.create(path.join(paths["component"], moduleName + ".json"), JSON.stringify(curModule));        
    } 

}
module.exports = init;