//下载
const {exec} = require("child_process");
function download(lib, callback){

    //获取code版本号;
    var code = "";
    for(var name in lib){
        code += " " + name + "@" + lib[name];
    }

    var command = "npm install" + code;
    console.log(command);
    exec(command, "", function(error, stdout, stderr){
        callback && callback();
    });
}

function create(callback){
    var config = require("./webpack.config.lib.js");
    var webpack = require("webpack");
    
    var compiler = webpack(config);
    compiler.run(function(a, b, c){
        callback(a, b, c);
    });
}

module.exports = {
    create: create,
    download: download
}