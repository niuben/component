var argv = require("optimist").argv;
var Add = require("./add.js");
var Del = require("./del.js");
var Git = require("./git.js");
var Template = require("../template.js");
// var Update = require("./add.js");
// var Search = require("./search.js");

switch(argv["operate"]){
    case "add":
        Add();
    break;
    // case "update":
    //     Update();
    // break;
    case "del":        
        Del();
    break;
    
    case "index":        
        Template.index();
    break;

    case "fetch":        
        Git.fetch();
    break;
    
}