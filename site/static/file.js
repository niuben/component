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