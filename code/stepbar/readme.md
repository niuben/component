## 分步条
表明当前在第几步，让用户知道剩几步需要操作.

### 场景
需要进行分布操作时.

### 安装
```
  npm install stepbar
  // yarn add stepbar
```

### API
| 属性名 | 说明 | 类型 | 默认值 |
| ------| ------ | ------ | ----- |
|title| 标题 | Array Object | [{ </br>    name: "步骤一", </br> text: "1" </br>},{</br> name: "步骤二" , </br>text: "2" </br>}]|


### 演示代码
```js
import React from 'react';
import { render } from 'react-dom';
import Stepbar from "./lib/index.js";

render(<Stepbar />, document.getElementById('root'));
```