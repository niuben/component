var path = require("path");
module.exports = {
    dist: path.join(__dirname, "../../dist"),
    component: path.join(__dirname, "../../component"),
    code: path.join(__dirname, "../../node_modules"),
    source: path.join(__dirname, "../code"),
    template: path.join(__dirname, "../site"),
    static: path.join(__dirname, "../site/static"),
    siteDist: path.join(__dirname, "../site/dist"),   
    service: path.join(__dirname),
    root: path.join(__dirname, "../.."),
    indexStatic: "/component/lib/site/static",
    detailStatic: "/component/lib/site/static",
    sourceStatic: "/component/lib/code/",
    detailDist: "/component/dist",    
    imgStatic: "/component/lib/site/static/img"
}
