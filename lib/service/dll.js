//下载
const {exec} = require("child_process");
function download(lib, callback){
    
    //获取code版本号;
    var code = "";    
    
    if(Object.prototype.toString.call(lib) === '[object Array]'){
        for(var i = 0; i < lib.length; i++){
            code += " " + lib[i];
        }
    }else{
        for(var name in lib){
            code += " " + name + "@" + lib[name];
        }
    }

    var command = "yarn add" + code;
    console.log(command);
    exec(command, "", function(error, stdout, stderr){
        callback && callback();
    });
}

function create(moduleName, libList, callback){
    var webpack = require("../../node_modules/webpack");
    
    var libArr = [];
    for(var lib in libList){
        libArr.push(lib);
    }
    var configFunc = require("./webpack.config.lib.js");    
    var config = configFunc(moduleName, libArr);
    
    var compiler = webpack(config);
    compiler.run(function(a, b, c){
        callback(a, b, c);
    });
}

module.exports = {
    create: create,
    download: download
}