const prompts = require('prompts');
const git = require("simple-git/promise");
const paths = require("../paths.js");
const path = require("path");
const FileObj = require("../file.js");
const fs = require("fs");
const rimraf = require("rimraf");

var argv = require("optimist").argv;

function searchArrObj(arr, key,val) {
    var isHave = 0;
    for(var i = 0; i < arr.length - 1; i++){
        if(arr[i][key] == val){
            return arr[i];
        }
    }
    return false;
}
var moduleName, localPath;

var config = {
    component: [{
            type: 'text',
            name: 'url',
            message: '输入项目git地址'
        },{        
            type: function(url){
                // console.log(url);

                moduleName = path.parse(url)["name"];    
                if(moduleName.indexOf(".git") != -1){
                    var moduleNameArr = moduleName.split(".");
                    moduleName = moduleNameArr[0];
                }            
                localPath = path.join(paths["source"], moduleName); 

                if(FileObj.isExit(localPath)){
                    return "confirm"
                }
                return null
            },
            name: 'isCover',
            message: '项目已经存在，是否覆盖?',        
        },{
            type: async function(prev, prevs){
                if(FileObj.isExit(localPath) == false || prev == true){
                    if(FileObj.isExit(localPath)){
                        rimraf.sync(localPath);
                    }
                    console.log("下载中...");
                    await git().clone(prevs["url"], localPath);
                    console.log("下载完成~");                
                }
                
                var inforObj = {};
                if(argv["operate"] == "add"){
                    var packagePath = path.join(localPath, "./package.json");                        
                    if(FileObj.isExit(packagePath)){
                        package = JSON.parse(FileObj.read(packagePath));                    
                    }
                    inforObj = package;
                }else{
                    inforObj = {}
                }
                
                //版本号
                var version = "";    
                if(inforObj["version"]){
                    var versionObj = searchArrObj(config["component"], "name", "version");
                    versionObj["initial"] = inforObj["version"];
                }

                //组件描述
                var content = "";    
                if(inforObj["content"]){
                    var contentObj = searchArrObj(config["component"], "name", "content");
                    contentObj["initial"] = inforObj["content"];
                }
                
                return "text";
            },
            name: 'version',
            message: '组件版本号',
            initial: ""
        },{
            type: 'text',
            name: 'content',
            message: '组件描述',
            initial: ""
        },{
            type: 'select',
            name: 'browser',
            message: '选择兼容浏览器',
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
        }],
    choose: [{
        type: "select",
        message: "请选择需要改的模块",
        choice: []
    }]   
}

module.exports = config;