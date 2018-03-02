// 请求模块
function require(path) {
  
  if(isExternalPath(path)){
    var bundleID = searchBundleID(path);
    return dll_bundle(bundleID);
  }
    
  var parentPath = parentPathArr.length != 0 ? parentPathArr[parentPathArr.length - 1] : "./";

  //获取当前位置
  // path = parsePath(path);
  var filePath = joinPath(parentPath, path);
  code = getContentFromPath(filePath, modules["module"]);

  var pathArr = path.split("/");
  var max = pathArr.length - 1;
  var fileName = max ? pathArr[max] : null; 

  if(path.indexOf(".js") != -1 || fileName.indexOf(".") == -1) {
    
    var newParentPath = getParentPath(filePath);
    parentPathArr.push(newParentPath);

    code = transformCode(code);
    return evalModule(code);
  }
  
  $("head").append("<style>" + code + "</style>");
  return null;    
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