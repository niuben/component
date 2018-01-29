// 请求模块
function require(path ) {
  
  if(isExternalPath(path)){
    var bundleID = searchBundleID(path);
    return dll_bundle(bundleID);
  }
  
  // if (path == "react") {
  //   return dll_bundle(83);
  // }

  // if (path == "react-dom") {
  //   return dll_bundle(99);
  // }

  // if (path == "react-router-dom") {
  //   return dll_bundle(63);
  // }

  path = parsePath(path);
  //获取当前位置
  var filePath = joinPath(parentPath, path);
  
  // var component = findModule(path),
  // code = component["file"] ? component["file"][path] : null,
  // componentName = component["name"] ? component["name"] : null;
  
  code = getContentFromPath(filePath, modules["module"]);

  if(path.indexOf(".js") != -1) {
    parentPath = getParentPath(filePath);
    
    code = transformCode(code);
    return evalModule(code);
  }

  // if(path.indexOf(".css") != -1) {
    // var fileName = getFileName(path);
    // code = evalCssModule(code, path);
  $("head").append("<style>" + code + "</style>");
  return null;
  // }
  
  //将scss转换为css 
  // if(path.indexOf(".scss") != -1) {
  //   // code = evalCssModule(code, path);
  //   sass.compile(code, function(cssCode){
  //     $("head").append("<style>" + cssCode.text + "</style>");
  //   }) 
  // }
  
}

/*
* 通过模块名称获取manifest中的ID
*/
function searchBundleID(moduleName){
  return modules["lib"][moduleName];
  // var manifest = modules["manifest"];
  // if(manifest == undefined){
  //   return null;
  // }

  // var externals = manifest["content"];
  // if(externals == undefined){
  //   return null;
  // }

  // for(var path in externals){
  //   var pathArr = path.split("/");    
  //   if(pathArr.indexOf(moduleName) != -1){
  //     return externals[path]["id"]
  //   }
  // }
  // return null;
}

//判断是否外部依赖
function isExternalPath(path){
  if(path.indexOf(".") == -1){
      return true;
  }
  return false;
}