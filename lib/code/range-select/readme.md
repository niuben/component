## 时间范围选择（下拉框）
通过两个下拉框选择时间

### 场景
在一个固定时间段内选择开始时间和结束时间；


### API
| 属性名 | 说明 | 类型 | 默认值 |
| ------| ------ | ------ | ----- |
|title|标题|string|请选择时间范围|
|tips|时间范围说明|string|请选择最近一个月|

### 演示代码
```js
import React from 'react';
import { render } from 'react-dom';
import RangeSelect from "./lib/index.js";

render(<RangeSelect />, document.getElementById('root'));
```