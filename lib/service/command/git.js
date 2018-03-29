const git = require("simple-git");

function fetch(){
    git().init().add("./*").commit("提交组件", function(a, b, c){
        console.log(a, b, c);
    }).push("origin", "master");
}

module.exports = {
    fetch: fetch
}