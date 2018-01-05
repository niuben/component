## 导航栏

### 组件列表
1. 登录
2. 城市选择器
3. Tab
4. 翻页
5. checkbox
6. 左侧菜单
7. 表格
8. 表单
10. 分布条
11. 注册协议
12. 下拉框
13. 复制链接
14. 日历范围选择器
15. 面包屑

### 演示
##### 标题展示
```jsx
import React from "react";
import ReactDom from "react-dom";
import Nav from "./nav.js";
ReactDom.render(<Nav title={"demo"}/>, document.getElementById("demo0"));
```

##### 点击返回
```jsx
import React from "react";
import ReactDom from "react-dom";
import Nav from "./nav.js";
ReactDom.render(<Nav />, document.getElementById("demo1"));
```

### 组件调试方案
* 功能：用户编写相关代码就可以实时运行代码;
* 实现方法
    * 通过eval方式运行代码;
        * 准备条件是需要生成一个组件的JSON格式; （通过node工具进行生成）
        * 是否要引入React、React-Dom和组件源文件: 需要（为了让用户更好明白代码逻辑）
        * 库文件怎么加载？比如React、ReactDOM、moment库。
        * 编辑器加载;
* README文件预览
    * 将README文件转为HTML文件；
    * 然后给HTML文件增加样式;
    * 给Code区域增加调试功能;

### API
| 属性 | 说明 | 类型 | 默认值 |
| ---  | --- | --- | ---|
|title | 标题 | string| 首页| 
|goBack | 返回函数 | event | null| 

## 快速开始

## 调式Node端代码
1. 打开Chrome浏览器的开发者工具;
2. node --inspect --inspect-brk getjson.js

### 版本历史
* v0.1.0: 查看组件列表和详情;
    * 生成统一数据结构;
    * 给每个组件编写readme文档;    
    * 添加首页;
    * 上传组件;
    
* v0.1.1: 完善展示功能;    
    * 增加scss嵌套支持;
    * 增加图片展示
    
* v0.2.0: 增加在线调试功能;