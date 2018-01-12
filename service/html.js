var jsdom = require("jsdom");

//创建首页
function createIndexPage(json){
    var content = readFile("./index.html");    
    var dom = new jsdom.JSDOM(content);
    var document = dom.window.document;
    
    var listTpl = document.getElementById("model");
    
    //创建列表    
    var files = json.files;
    files.map(function(item){
        
        //设置预览地址
        var firstHTMLPath = getFirstHTML(item["files"], item["path"]);
        listTpl.content.querySelector("iframe").src = "." + firstHTMLPath;
        
        //设置详情页链接和标题
        listTpl.content.querySelector("a").href = "/dist/" + item["url"] + ".html";
        listTpl.content.querySelector(".tt").innerHTML = item.title || item.name;

        document.querySelectorAll(".content")[1].appendChild(document.importNode(listTpl.content, true));        
    })
    createFile("./dist/index.html", document.getElementsByTagName("html")[0].outerHTML);
};

//创建列表页
function createDetailPage(json) {
    var content = readFile("./do.html");
    var dom = new jsdom.JSDOM(content);
    var document = dom.window.document;

    var files = json.files;    
    files.map(function(item, index){
        
        
        var tplObj = {
            fileTree: "<ul>" + createFileMenu(item["files"]) + "</ul>",
            title: item["title"] || item["name"], //组件名称
            markdown: decodeURIComponent(markdown), //Makadown内容 
            config: "var config = " + JSON.stringify(item), //数据配置 
            src:  "." + firstHTMLPath//初始组件预览            
        };


        

        //获取第一个HTML地址,并写入初始预览HTML路径
        // var firstHTMLPath = getFirstHTML(item["files"], item["path"]);
        // document.querySelector("iframe").src = "." + firstHTMLPath;
        // createFile("./dist/" + item["url"] + ".html", "<!DOCTYPE html>" + document.getElementsByTagName("html")[0].outerHTML);
        
        var doTpl = template(readFile("./do.html"));
        // console.log("tpl", doTpl({value: "hello world"}));
        createFile("./dist/" + item["url"] + ".html", doTpl(tplObj));
    });

}