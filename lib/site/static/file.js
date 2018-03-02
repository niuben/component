//获取ID
function getFile(dir, base) {
  //require路径和当前文件路径组合成一个绝对路径
  dir = base + dir;

  function search(name, arr) {
    var obj = null;
    arr.map(function(item) {
      if (item["name"] == name) {
        obj = item;
      }
    });
    return obj;
  }

  //根据路径一层层的找文件对象
  var dirNameArr = dir.split("/");
  var dirObjArr = dirJson;
  dirNameArr.map(function(name) {
    dirObjArr = search(name, dirObjArr);
    if (dirObjArr && dirObjArr.children) {
      dirObjArr = dirObjArr.children;
    }
  });
  return dirObjArr;
}

//获取图片地址
function getImgUrl(code, path) {
  //如果code等于undefined或者null,直接返回为空
  if (!code) {
    return "";
  }

  var cssArr = code.split("}");

  var urlPatten = /url\((.)*\)/gi;
  var imgBasePath = "../src/widget";

  //文件名设定为组件名
  var componentName = getFileName(path);

  //将查找图片
  for (var i = 0; i < cssArr.length; i++) {
    var imgArr = cssArr[i].match(urlPatten);
    if (!imgArr || imgArr.length == 0) {
      continue;
    }

    //获取图片Url
    var imgUrl = imgArr[0],
      startPos = imgUrl.indexOf("("),
      endPos = imgUrl.indexOf(")");

    var imgName = imgUrl.substr(startPos + 1, endPos - startPos - 1);

    cssArr[i] = cssArr[i].replace(
      urlPatten,
      "url(" + imgBasePath + "/" + componentName + "/" + imgName + ")"
    );
    // console.log("img", imgName);
  }
  code = cssArr.join("}");
  return code;
}

//文件名
function getFileName(filePath){
    var fileArr = [],
        fileName = null;
    
    if(filePath.indexOf("/") != -1){
      fileArr = filePath.split("/");
      fileName = fileArr[fileArr.length - 1];
    }
    
    if(typeof fileName == "string" && fileName.indexOf(".") != -1){
      fileArr = fileName.split(".");
      fileName = fileArr[0];
    }
    
    return fileName;
}

function joinPath(parentPath, path){
    var parentPathArr = parentPath.split("/"),
              pathArr = path.split("/");

    var newPathArr = [];
    //等于    
    pathArr.map(function(path){
      if(path == ".") {
          null
      } else if(path == ".."){
        parentPathArr.pop();        
      }else {
        newPathArr.push(path);
      }
    });

    return parentPathArr.concat(newPathArr).join("/");
}

function getParentPath(path){
  var pathArr = path.split("/");
  pathArr.pop();

  return pathArr.join("/");
}

/*
* 根据路径结构获取对象
*/
function getParentObjFromPath(path, obj){
  var pathArr = path.split("/");
  var curObj = obj;

  //
  pathArr.map(function(name){
      if(name == "."){
          return;
      }

      for(var key in curObj){            
          if(typeof key == "string" && typeof name == "string" && key.toLowerCase() == name.toLowerCase() && typeof curObj[key] == "object"){
              curObj = curObj[key];
          }
      }
  });

  return curObj;  
}

/*
* 根据
*/
function getContentFromPath(path, obj){
  var pathArr = path.split("/");
  var name = pathArr[pathArr.length - 1];
  var parentObj = getParentObjFromPath(path, obj);
  
  // return parentObj[fileName];
  if(typeof parentObj != "object"){
    return null;    
  }

  for(var key in parentObj){

    if(typeof key != "string" || typeof name != "string"){
      continue;
    }

    if(key.toLowerCase() == name.toLowerCase()){
      return parentObj[key];    
    }

    //匹配文件没有后缀名的情况，比如：/A/B。B的文件类型可能有很多中
    var fileNameArr = key.split(".");
    if(name.indexOf(".") == -1 && fileNameArr[0] == name){
      return parentObj[key];
    }

  }

}

/*
* 处理路径
*/
function parsePath(path){
  var pathArr = path.split("/");
  if((pathArr[0] == "." || pathArr[0] == "..") && pathArr.length > 1 && pathArr[pathArr.length - 1].indexOf(".") == -1){
      path = path + ".js";
  }
  return path;
}
