/*
*删除没有标记的属性和对象
{
    a: {
        "$b.js": "123123123"
    },
    c: {
        "d.js": "23232323"
    }
}
*/
function clearObj(obj){
    var isUsed = false;
    for(var key in obj){
        if(typeof obj[key] == "object"){
            if(clearObj(obj[key])){
                isUsed = true;
            }else{
                delete obj[key];
            }                            
        }
        
        //
        if(typeof obj[key] == "string"){
            if(key.indexOf("$") == -1){
                delete obj[key];
            }else{
                isUsed = true;
            }
        }
    }
    
    //如果这个对象没有被使用
    if(isUsed == false){
        return false;
    }
    // return obj;
    return obj;
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
            if(key == name && typeof curObj[key] == "object"){
                curObj = curObj[key];
            }
        }
    });

    return curObj;  
}


module.exports = {
    clear: clearObj,
    getParentFromPath: getParentObjFromPath
}  