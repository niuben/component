// 请求模块
function require(path, baseDir) {
  if (path == "react") {
    return dll_bundle(0);
  }
  if (path == "react-dom") {
    return dll_bundle(26);
  }

  if (path == "react-router-dom") {
    return dll_bundle(63);
  }

  var component = findModule(path),
    code = component["file"] ? component["file"][path] : null,
    componentName = component["name"] ? component["name"] : null;
    if(path.indexOf(".js") != -1) {      
    code = transformCode(code);
    return evalModule(code, componentName, component["props"]);
  }

  //
  // if(path.indexOf(".css") != -1) {
    // var fileName = getFileName(path);
    // code = evalCssModule(code, path);
    $("head").append("<style>" + code + "</style>");
    // return;
  // }
  
  //将scss转换为css
  // if(path.indexOf(".scss") != -1) {
  //   // code = evalCssModule(code, path);
  //   sass.compile(code, function(cssCode){
  //     $("head").append("<style>" + cssCode.text + "</style>");
  //   }) 
  // }
  
}
