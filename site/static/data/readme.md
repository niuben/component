## 时间范围选择（下拉框）
通过两个下拉框选择时间

## 安装
```
npm install dropdown
```

### 场景
在一个固定时间段内选择开始时间和结束时间；

### API
| 属性名 | 说明 | 类型 | 默认值 |
| ------| ------ | ------ | ----- |
|title|标题|string|请选择时间范围|
|tips|时间范围说明|string|请选择最近一个月|

### 代码展示
```js
import React from "react";
import ReactDom from "react-dom";
import Dropdown from "./dropdown.js";
ReactDom.render(<Dropdown infor={{
      title: "学生列表",
      list: [
        { name: "张三", value: 1 },
        { name: "李四", value: 2 },
        { name: "王五", value: 3 }
      ]
    }}
/>, document.getElementById("root"));
```