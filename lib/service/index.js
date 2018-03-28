var FileObj = require("./file.js");
var path = require("path");
var Dir = require("./dir.js");
var Parse = require("./parse.js");
var Obj = require("./object.js");
var fs = require("fs");
var Sass = require("./sass.js");
var dll = require("./dll.js");
var paths = require("./paths.js");
var Component = require("./component.js");
var argv = require("optimist").argv;
var Template = require("./template.js");
var Marked = require("marked");
const {exec} = require("child_process");

function build(curModule){    

    // if(curModule["isModule"] == false){
    //     return;
    // }
    // var command = "cd " + path.join(__dirname, "../code/select && yarn");

    var moduleName = curModule["name"];
    var modulePath = path.join(paths["source"], moduleName);
    var command = "cd " + modulePath + " && yarn";    

    exec(command, "", function(error, stdout, stderr){
        
        if(error != null){
            return;
        }
            
        var webpack = require("../../node_modules/webpack");
        var configFunc = require("./webpack.config.js");
                
        var alias = {}        
        alias[moduleName] = path.join(modulePath, Parse.getMain(modulePath));
                
        var entry = Template.getEntry(curModule);
        entry = path.join(modulePath, entry);
        
        var config = configFunc(moduleName, entry, alias);
        var compiler = webpack(config);
        compiler.run(function(a, b, c){
            // var manifestPath = path.join(paths["dist"], moduleName, "manifest.json");
            // if(FileObj.isExit(manifestPath)){
            //     var manifest = JSON.parse(FileObj.read(manifestPath));
            //     curModule["manifest"] = manifest["content"];
            // }
            // Template.preview(curModule);
        });
    });
}

module.exports = {
    build: build
}