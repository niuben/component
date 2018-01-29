## 下拉框
向下弹出一个列表

### 场景
有多个选项选择且没有过多的空间全部展示出来, 一般使用表单情况下。

### 安装
```
npm install sogo-dropdown
// yarn add sogo-dropdown
```

### API
| 属性名 | 说明 | 类型 | 默认值 |
| ------| ------ | ------ | ----- |
|title| 标题 |string|请选择|
|list|下拉框展示的内容|Array Object|[]|

### 事例代码
```js
import React from 'react';
import { render } from 'react-dom';
import Dropdown from "./lib/index.js";

render(<Dropdown infor={{
    title: "学生列表",
    list: [
        { name: "张三", value: 1 },
        { name: "李四", value: 2 },
        { name: "王五", value: 3 }
    ]
 }}/>, document.getElementById('root'));
```