var FileObj = require("./file.js");
var fs = require("fs");
var Path = require("path");
var paths = require("./paths.js");
var Dir = require("./dir.js");
var dll = require("./dll.js");

function getList(){
    var list = Dir.toJSON(paths.component);
    var componentArr = [];
    for(var component in list){
        componentArr.push(JSON.parse(list[component]));
    }
    return componentArr;
}

function getListName(componentArr){
    var componentNameArr = [];
    componentArr.map(function(component){
        componentNameArr.push(component["name"]);
    });
    return componentNameArr;
}

//下载模块
function download(componentNameArr, callback){
        
    // console.log(componentNameArr);
    dll.download(componentNameArr, function(msg){
        callback && callback(msg);
    });
}

module.exports = {
    getList: getList,
    getListName: getListName,
    download: download 
}
