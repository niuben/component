const git = require("simple-git");

function fetch(infor){
    console.log("正在提交更新......")
    git().init().add("./*").commit("提交更新内容", function(err, result){
        if(err == null){
            console.log("提交成功~")
        }
    }).push("origin", "master");
}

module.exports = {
    fetch: fetch
}