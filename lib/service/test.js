var os = require("os");
const prompts = require('prompts');
async function command(){
	// var obj = {
	// 	a: 2,
	// 	b: 2		
	// }
	
	// var fileDir = "D:\component\dist\react-viewport-slider\preview.png";
	// var Url = "D:\component\dist\react-viewport-slider\preview.png"
	// // console.log(argument);
	// console.log(os.type())
	var response = await prompts([{
		type: 'text',
        name: 'git',
        message: '输入组件git地址',
        initial: ""
	}]);
		
	console.log(response);
}
var log = command();