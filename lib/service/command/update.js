const prompts = require('prompts');
const git = require("simple-git/promise");
const paths = require("../paths.js");
const path = require("path");
const FileObj = require("../file.js");
const fs = require("fs");
const rimraf = require("rimraf");
const Dir = require("../dir.js"); 
const Index = require("../index.js");
const ToJson = require("../toJson.js");

const {exec} = require("child_process");
module.exports = function(){    


    var response = await prompts([{
        type: 'text',
        name: 'url',
        message: '输入项目git地址',
        // format: function(val){
        //     return {
        //         name: "url2"                
        //     }
        // },
        onState: function(msg, msg1){
            // console.log("msg", msg);
            // console.log("msg1", msg1);
        },
        initial: "123",
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
        }]
    }, {
        type: function(prev, prevs){ 
            // console.log("prevs", prevs);
            return prev == 'pizza' ? 'text' : null;
        },
        name: "choose",
        message: "是否确认?"
    }]);

    console.log(response);

    //输入框Git地址
    // var response = await prompts([{
    //     type: 'text',
    //     name: 'url',
    //     message: '输入项目git地址'
    // }]);

    // var url = response["url"];
    // var config = {
    //     isModule: true
    // };
    // // var url = "https://github.com/verlok/lazyload";
    
    // //获取项目名称;    
    // var moduleName = path.parse(url)["name"];    
    // if(moduleName.indexOf(".git") != -1){
    //     var moduleNameArr = moduleName.split(".");
    //     moduleName = moduleNameArr[0];
    // }
    // config["name"] = moduleName; 
    
    // //监测项目是否存在    
    // var localPath = path.join(paths["source"], moduleName);    
    // if(FileObj.isExit(localPath)){
    //     response = await prompts([{
    //         type: 'confirm',
    //         name: 'isCover',
    //         message: '项目已经存在，是否覆盖?'
    //     }]);        
    //     if(response["isCover"] == true){        
    //         rimraf.sync(localPath);        
    //     }
    // }
    
    // if(response["isCover"] == true || response["isCover"] == undefined){
    //     console.log("下载中...");        
    //     async function clone(){
    //         // exec("git clone " + url + " " + localPath);            
    //     }
        
    //     await git().clone(url, localPath);        
    //     console.log("下载完成~");
    // }
    
    // //找到模块的入口文件
    // var packagePath = path.join(localPath, "./package.json");
    // var package = null;
        
    // if(FileObj.isExit(packagePath)){
    //     package = FileObj.read(packagePath);        
    // }
    
    // //版本号
    // var version = "";    
    // if(package["version"]){
    //     config["version"] = package["version"];
    // }
    // var response = await prompts([{
    //     type: 'text',
    //     name: 'version',
    //     message: '组件版本号',
    //     initial: content
    // }]);     
    // config["version"] = response["version"]; 

    // //组件描述
    // var content = "";
    // if(package["content"] != undefined){
    //     content = package["content"];
    // }    
    // var response = await prompts([{
    //     type: 'text',
    //     name: 'content',
    //     message: '组件描述',
    //     initial: content
    // }]);     
    // config["content"] = response["content"];

    // //浏览器描述
    // var response = await prompts([{
    //     type: 'select',
    //     name: 'browser',
    //     message: '选择兼容浏览器',
    //     choices: [{
    //         title: "IE6及以上",
    //         value: "ie6"
    //     },{
    //         title: "IE7及以上",
    //         value: "ie7"
    //     },{
    //         title: "IE8及以上",
    //         value: "ie8"
    //     },{
    //         title: "IE9及以上",
    //         value: "ie9"
    //     },{
    //         title: "IE10及以上",
    //         value: "ie10"
    //     },{
    //         title: "IE11及以上",
    //         value: "ie11"
    //     }],
    //     hint: '选择某个浏览器，证明支持比它版本高浏览器'
    // }]);  
    // config["browser"] = response["browser"];

    // //选择事例项目代码目录
    // var json = Dir.toJSON(localPath);
    // var prevDir = json;
    // var prevPath = "./";        
    // async function selectDir(dirObj, _path){        
        
    //     var choices = _path == "./" ? [] : [{
    //         title: "上一层",
    //         value: "~"
    //     }];

    //     for(var name in dirObj){
    //         choices.push({
    //             title: name,
    //             value: name
    //         });                
    //     }        
        
    //     // console.log("choices", choices);
    //     // FileObj.create(path.join(paths["dist"], "choices.json"), JSON.stringify(choices));
    //     var response = await prompts({
    //         type: 'select',
    //         name: 'demo',
    //         message: '选择Demo文件地址',
    //         choices: choices        
    //     });

    //     // console.log("response", response);            
    //     var choose = response["demo"];
    //     var curDir;
    //     if(choose != "~"){
    //         for(var name in dirObj){
    //             if(choose == name){
    //                 curDir = dirObj[name];                
    //                 prevDir = dirObj;
    //                 prevPath = _path;
    //                 break;
    //             }
    //         }
    //     }else{
    //         curDir = prevDir;
    //     }
        
    //     if(typeof curDir == "object"){            
    //         _path = choose != "~" ? _path + response["demo"] + "/" : prevPath;
    //         console.log("当前文件路径:", _path);
    //         return selectDir(curDir, _path);
    //     }else{
    //         _path += response["demo"];
    //     }        
    //     return _path;
    // }
    // config["example"] = await selectDir(json, "./");
    
    // //选择的文件路径
    // console.log("选择文件路径", config["example"]);

    // FileObj.create(path.join(paths["component"], moduleName + ".json"), JSON.stringify(config));

    // // Index.build(moduleName);
    // // ToJson.init();
    // Index.build(config);
}