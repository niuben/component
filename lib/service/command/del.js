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

module.exports = async function(){    
    var list = Dir.toJSON(paths["component"]);
    var choices = [];
    for(var fileName in list){
        var prevFileName = FileObj.getPrevName(fileName);
        choices.push({
            title: prevFileName,
            value: fileName 
        });
    }
    var resultObj = await prompts([{
        type: 'select',
        name: 'component',
        message: '选择要删除的组件',
        choices: choices
    },{
        type: 'toggle',
        name: 'isDel',
        message: (jsonName)=>{
            var name = FileObj.getPrevName(jsonName);
            return `选择要删除${name}组件吗？`;
        },
        initial: true,
        active: '是',
        inactive: '否'
    }]);

    //
    if(resultObj["isDel"] == true){
        var jsonName = resultObj["component"];
        var name = FileObj.getPrevName(jsonName);

        console.log("正在删除" + name + "组件......");
        
        rimraf.sync(path.join(paths["component"], jsonName));
        rimraf.sync(path.join(paths["dist"], name));
        rimraf.sync(path.join(paths["source"], name));

        console.log("删除成功~");
    }   

};