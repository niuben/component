var path = require("path");
module.exports = {
    dist: path.join(__dirname, "../../dist"),
    component: path.join(__dirname, "../../component"),
    code: path.join(__dirname, "../../node_modules"),
    template: path.join(__dirname, "../site"),
    static: path.join(__dirname, "../static"),
    service: path.join(__dirname),
    root: path.join(__dirname, "../.."),
    indexStatic: "/lib/site/static",
    detailStatic: "/lib/site/static",
    detailDist: "/dist",
    siteDist: "/lib/site/dist"
}
