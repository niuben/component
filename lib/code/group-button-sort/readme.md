## 排序按钮组
点击单个按钮后按钮选中，其他按钮取消选中;

### 场景
需要进行单选的场景下,比如选择性别

### 安装
```
    npm install group-button-sort
    // yarn add group-button-sort
```

### API
| 属性名 | 说明 | 类型 | 默认值 |
| ------| ------ | ------ | ----- |
|list|展示数据|Array|[{ name: "选项1" <br/>, value: "0" <br/>, order: "desc"} <br/>,{ name: "选项2" <br/>, value: "1" <br/>,order: "desc"}]|


### 演示代码
```js
import React from 'react';
import { render } from 'react-dom';
import GroupButtonSort from "./lib/index.js";

render(<GroupButtonSort />, document.getElementById('root'));
```