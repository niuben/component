var FileObj = require("./file.js");
// var code = 'import {code} from "js/code.js"';
var code = 'import React from "react";import "./index.scss";export default class Dropdown extends React.Component {    constructor(props){        super(props);        this.state = {            visiable: false,            infor:  this.props.infor,                    }            }    componentDidMount(){        document.onclick = (e)=>{            if(this.state.visiable == true){                this.state.visiable = false;                this.forceUpdate();            }        }    }    render() {        var styleObj = {};        if(this.props.width) {            styleObj = {                width: this.props.width            }        }        return (<div className="dropdown" style={styleObj}><div className="dropbtn" onClick={(e)=>{                    e.stopPropagation();                    e.nativeEvent.stopImmediatePropagation();                    this.state.visiable = true;                    this.forceUpdate();                    }}>{this.state.infor.title}</div>                {<div className={this.state.visiable == false ? "dropdown-content" : "dropdown-content active"} >                        {                            this.state.infor.list.map((item, index)=>{                                return<a href="javascript:void(0)" className={this.state.infor.value == item.value ? "active" : null} key={index} onClick={(e)=>{                                    this.state.infor.title = item.name;                                    this.state.infor.value = item.value;                                    this.props.onChange && this.props.onChange(this.state.infor.value);                                    this.state.visiable = false;                                    this.forceUpdate();                                }}>{item.name}</a>                            })                        }</div>                }</div>        )    }}';
var modules = {
    component: [{
        id: "1",
        name: "",
        file: {}
    }]
};
var obj = modules["component"][0]["file"];
var num = 0;
function parse(code){  
    var path;
    if(code.indexOf("import") != -1){
        var codeArr = code.split(" ");                 
        //最后一个数组是文件地址
        var length = codeArr.length;
        path = codeArr[length - 1];

        // if(codeArr.length == 4){
        //     path = codeArr[3];
        // }else if(codeArr.length == 2) {
        //     path = codeArr[1];
        // }

    }else if(code.indexOf("require") != -1){
     var startPos = code.indexOf("("),
         endPos = code.indexOf(")");    
     path = code.substr(startPos + 1, endPos - startPos - 1); 
    }

    //去除path中的双引号和单引号
    if(path != undefined){
        path = path.replace(/"|'/g, "");
        // console.log(num++);
        obj[path] = null;
    }
}

//
function parseFile(code){
    var textArr = code.split(";");
    for(var i = 0; i < 5; i++){
        parse(textArr[i]);
    }

    //删除库文件的path
    for(var path in obj){
        if(path == "react" || path == "react-dom"){
            delete obj[path];
            continue;
        }    
        
        //如果文件有值的话，证明已经调用到parseFile方法
        if(obj[path] != null){
            continue;
        }

        var basePath = __dirname + "/../code/dropdown/lib/";
        var filePath = basePath + path;
        var content = FileObj.read(filePath);        
        obj[path] = content;

        //获取的文在再次进行解析
        if(content.length != 0){
            // console.log("Parse Path", path);
            parseFile(content);
        }
    }

    // console.log(obj);
}

//通过输入模块名称，解析模块中入口文件和readme文件
function parseModule(name){
    var basePath =  __dirname + "/../code/";
    var modulePath = basePath + name;
    var readmePath = modulePath + "/" + "readme.md";
    var packagePath = modulePath + "/" + "package.json";

    //添加readme文档
    if(FileObj.isExit(readmePath)){        
        obj["readme"] = FileObj.read(readmePath);
    }
    
    //获取package.json文件
    var package = JSON.parse(FileObj.read(packagePath));

    //设置入口文件
    var entry = package["main"];
    var entryPath = modulePath + "/" + entry;
    var entryContent = FileObj.read(entryPath);
    obj[entry] = entryContent;

    // console.log("entryContent", entryContent);    
    parseFile(entryContent);
    // console.log(FileObj.read(packagePath));
}

parseModule("stepbar");
console.log(obj);

// parseFile(code);
FileObj.create("../site/static/data/stepbar.json", JSON.stringify(modules));