var FileObj = require("./file.js");
var cheerio = require('cheerio');
// var jsdom = require("jsdom");
var content = FileObj.read("/Users/niuben-sogou/www/component/lib/code/slider/index.html");
// console.log(content);

// var $ = cheerio.load('<html><head><title>轮播图</title><meta charset="UTF-8"><link rel="stylesheet" href="./index.css"></head><body><div class="unslider-container"><ul><li><a href="#"><img class="lazy" src="http://p2.123.sogoucdn.com/imgu/2014/12/20141204113705_327.jpg" /><span class="pic-cover"></span><i></i><span>最快周三将对占中者清2</span></a></li><li><a href="#"><img class="lazy" src="http://p2.123.sogoucdn.com/imgu/2014/12/20141204113705_327.jpg"/><span class="pic-cover"></span><i></i><span>最快周三将对占中者清2</span></a></li><li><a href="#"><img class="lazy" src="http://p2.123.sogoucdn.com/imgu/2014/12/20141204113705_327.jpg" /><span class="pic-cover"></span><i></i><span>最快周三将对占中者清2</span></a></li></ul></div><script src="./jquery-1.12.1.js"></script><script src="./jquery.unslider.js"></script><script src="./index.js"></script></body></html>');
// var $ = cheerio.load(content);

// // $("html").length
// console.log($("link").attr("href"));
// console.log($("link").length);
// console.log($("body").text());

function getContent(content){
    var $ = cheerio.load(content);
    var obj = {
        link: [],
        css: "",
        tpl: "",
        script: [],                
        js: ""
    };
        
    //获取css文件路径
    $("head link").each(function(){
        obj["link"].push($(this).attr("href"));
    });
    $("#head style").each(function(){
        obj["css"] += $(this).text();
    })

    //获取script
    console.log($("body script").length);

    $("body script").each(function(){        
        var src = $(this).attr("src");        
        if(src != undefined){
            obj["script"].push(src);
        }else{
            obj["js"] = $(this).text(); 
        }
    });

    //获取body标签内容
    $("body script").remove();
    obj["tpl"] = $("body").html();
    
    return obj;
}

// getContent(content);
//创建首页
// function createIndexPage(json){
//     var content = readFile("./index.html");    
//     var dom = new jsdom.JSDOM(content);
//     var document = dom.window.document;
    
//     var listTpl = document.getElementById("model");
    
//     //创建列表    
//     var files = json.files;
//     files.map(function(item){
        
//         //设置预览地址
//         var firstHTMLPath = getFirstHTML(item["files"], item["path"]);
//         listTpl.content.querySelector("iframe").src = "." + firstHTMLPath;
        
//         //设置详情页链接和标题
//         listTpl.content.querySelector("a").href = "/dist/" + item["url"] + ".html";
//         listTpl.content.querySelector(".tt").innerHTML = item.title || item.name;

//         document.querySelectorAll(".content")[1].appendChild(document.importNode(listTpl.content, true));        
//     })
//     createFile("./dist/index.html", document.getElementsByTagName("html")[0].outerHTML);
// };

// //创建列表页
// function createDetailPage(json) {
//     var content = readFile("./do.html");
//     var dom = new jsdom.JSDOM(content);
//     var document = dom.window.document;

//     var files = json.files;    
//     files.map(function(item, index){
        
        
//         var tplObj = {
//             fileTree: "<ul>" + createFileMenu(item["files"]) + "</ul>",
//             title: item["title"] || item["name"], //组件名称
//             markdown: decodeURIComponent(markdown), //Makadown内容 
//             config: "var config = " + JSON.stringify(item), //数据配置 
//             src:  "." + firstHTMLPath//初始组件预览            
//         };


        

//         //获取第一个HTML地址,并写入初始预览HTML路径
//         // var firstHTMLPath = getFirstHTML(item["files"], item["path"]);
//         // document.querySelector("iframe").src = "." + firstHTMLPath;
//         // createFile("./dist/" + item["url"] + ".html", "<!DOCTYPE html>" + document.getElementsByTagName("html")[0].outerHTML);
        
//         var doTpl = template(readFile("./do.html"));
//         // console.log("tpl", doTpl({value: "hello world"}));
//         createFile("./dist/" + item["url"] + ".html", doTpl(tplObj));
//     });

// }
module.exports = {
    get: getContent
}