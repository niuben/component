var modules= {"component":[{"id":"1","name":"stepbar","file":{"./lib/index.js":"import React from \"react\";\nimport \"./index.scss\";\nimport \"./reset.scss\";\nconst title = [{\n  name: \"步骤一\",\n  text: \"1\"\n},{\n  name: \"步骤二\",\n  text: \"2\"\n},{\n  name: \"步骤三\",\n  text: \"3\"\n},{\n  name: \"步骤四\",\n  text: \"4\"\n}];\n\nexport default class Title extends React.Component {\n  constructor(props){\n    super(props);\n    this.title = this.props.title || title; \n  } \n  nextstep(index) {\n   \n    if( this.props.step > index || this.props.step === title.length - 1 ) {\n      return 'active last'\n    } else if(this.props.step === index) {\n      return 'active'\n    } \n  }\n\n  render() {\n    return(\n      <div className=\"cartbar\">\n        <ul className=\"title clearfix\">\n        {\n            this.title.map((item, index) =>{\n              return <li key={index} className={ this.nextstep(index)}>\n                <h3>{item.name}</h3>\n                <p><i>{item.text}</i></p>\n            </li>\n            })\n        }\n        </ul>\n      </div>\n    )\n  }\n}","readme":"## 分步条\n表明当前在第几步，让用户知道剩几步需要操作.\n\n### 场景\n需要进行分布操作时.\n\n### 安装\n```\n  npm install stepbar\n  // yarn add stepbar\n```\n\n### API\n| 属性名 | 说明 | 类型 | 默认值 |\n| ------| ------ | ------ | ----- |\n|title| 标题 | Array Object | [{ </br> name: \"步骤一\" </br>, text: \"1\" </br>},{</br> name: \"步骤二\" </br>, text: \"2\" </br>}]|\n\n\n### 演示代码\n```js\nimport React from 'react';\nimport { render } from 'react-dom';\nimport Stepbar from \"./lib/index.js\";\n\nrender(<Stepbar />, document.getElementById('root'));\n```","./index.scss":".cartbar {\n    background-color: #fafafa;\n    .title {\n        li {\n            float: left;\n            width: 25%;\n        }\n        h3 {\n            margin: 25px 0 20px;\n            color: #333;\n            font-size: 16px;\n            text-align: center;\n        }\n        p {\n            position: relative;\n            width: 100%;\n            height: 3px;\n            background-color: #ccc;\n        }\n        i {\n            position: absolute;\n            top: -10px;\n            left: 50%;\n            margin-left: -11px;\n            width: 22px;\n            height: 22px;\n            line-height: 22px;\n            color: #fff;\n            font-size: 14px;\n            text-align: center;\n            border-radius: 50%;\n            background-color: #ccc;\n        }\n        .active {\n            p {\n                background: #3697fd url(./cart_bg.jpg) right no-repeat;\n            }\n            i {\n                background-color: #3697fd;\n            }\n        }\n        .last {\n            p {\n                background-image: none;\n            }\n        }\n    }\n}","./reset.scss":"\n    * {\n        margin: 0;\n        padding: 0;\n        font-family: \"微软雅黑\";\n    }\n\n    h1,\n    h2,\n    h3,\n    h4,\n    h5,\n    h6 {\n        font-size: 100%;\n        font-weight: 400;\n    }\n\n    details,\n    figcaption,\n    figure,\n    menu {\n        display: block;\n    }\n\n    ol,\n    li {\n        list-style: none;\n    }\n\n    input,\n    select,\n    textarea {\n        outline: none;\n    }\n\n    img {\n        display: block;\n        border: 0 none;\n    }\n\n    i,\n    em {\n        font-style: normal;\n    }\n\n    b {\n        font-weight: 400;\n    }\n\n    table {\n        border-collapse: collapse;\n        border-spacing: 0;\n    }\n\n    q {\n        quotes: none\n    }\n\n    a {\n        cursor: pointer;\n        text-decoration: none;\n        font-family: \"微软雅黑\";\n    }\n\n\n    /* 清除浮动 */\n\n    .clearfix:after {\n        content: '\\0020';\n        display: block;\n        height: 0;\n        clear: both\n    }\n\n    .clearfix {\n        *zoom: 1\n    }\n\n\n    /* 省略号样式 */\n\n    .ellipsis {\n        text-overflow: ellipsis;\n        white-space: nowrap;\n        overflow: hidden;\n    }\n\n\n    /* 禁止选择  */\n\n    .unselected {\n        -webkit-user-select: none;\n        -khtml-user-select: none;\n        -moz-user-select: none;\n        -o-user-select: none;\n        user-select: none;\n    }\n"}}]}