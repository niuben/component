var os = require("os");
const prompts = require('prompts');
const {exec} = require("child_process");
const screenshot = require("./screenshot.js");
const httpServer = require("http-server");

function command(){

	console.log(httpServer.HTTPServer());
	
	// var obj = {
	// 	a: 2,
	// 	b: 2		
	// }
	
	// var fileDir = "D:\component\dist\react-viewport-slider\preview.png";
	// var Url = "D:\component\dist\react-viewport-slider\preview.png"
	// // console.log(argument);
	// console.log(os.type())
	// var response = await prompts([{
	// 	type: 'text',
    //     name: 'git',
    //     message: '输入组件git地址',
    //     initial: ""
	// }]);

	// console.log(response);

	// var ls = exec("node ./node_modules/.bin/http-server ./ -p 63001", " ", function(infor, stdout, stderr){
	// 	console.log(infor, stdout, stderr);		
	// });

	// ls.stdout.on("data", function(msg, a, b){
	// 	// console.log(data, typeof data);
	// 	var msgArr = [];
	// 	if(typeof msg == "string"){
	// 		msgArr = msg.split("\n");		
	// 	}
	// 	console.log(msgArr, msgArr.length);
	// 	if(msgArr.length != 4){
	// 		return;
	// 	}
		
	// 	var host = msgArr[1].replace(" ", "");
	// 	var url = "http://127.0.0.1:63001/dist/videoplayer/video.html";
	// 	console.log(url); 

	// 	screenshot.build(url, "./preview.png", function(){
	// 		console.log("截图成功");
	// 	});
	// })

	// setTimeout(function(){
	// 	screenshot.build("http://10.129.20.178:8080/dist/videoplayer/video.html", "./preview.png", function(){
	// 		console.log("截图成功");
	// 	});
	// }, 2000);

}
var log = command();