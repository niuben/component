const git = require("simple-git");

function fetch(infor){
    git().init().add("./*").commit("提交更新内容", function(a, b, c){
        console.log(a, b, c);
    }).push("origin", "master");
}

module.exports = {
    fetch: fetch
}