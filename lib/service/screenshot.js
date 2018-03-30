var webshot = require("webshot");
var path = require("path");
var paths = require("./paths.js");

function build(url, dist, callback){  

    console.log("正在为组件截图......");    
    webshot(url, dist, function(err, a, b, c){
        // console.log("err", err, a, b, c);
        if(err == null){
            console.log("截图完成")
        }
        callback && callback();
    });
}
module.exports = {
    build: build
}
// var png = path.join(paths["dist"], "videoplayer", "preview.jpg");
// console.log(png);