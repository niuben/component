// 执行代码
function evalModule(code) {
  var module = {};
  var exports = {}; 
  

  try {
    eval(code); 
    parentPathArr.pop();
    return Object.keys(exports || {}).length > 0 ? exports : module.exports;
  } catch (e) {
    e.isEvalError = true;
    throw e;
  }
  
}

// 搜索模块
function findModule(path, is) {
  var file = null,
    currentComponent = {};
  modules["component"].map(component => {
    if (component["file"][path] !== undefined) {      
      currentComponent = component;
    }
  });

  return currentComponent;
}

// function findModule(path){  
// }

/*
* 解析Css模块
*/
function evalCssModule(code, path){
    return getImgUrl(code, path);
}
   
//等待
function setModule(path, code) {
    modules[path] = code;
}

//代码转换
function transformCode(code){  
  try{
    return Babel.transform(code, {
      presets: ["react", "es2015"]
    }).code;
  }catch(e){
    return null;
  }
  
}



