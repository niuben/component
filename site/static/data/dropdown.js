var modules = {
  component: [
    {
      id: "0",
      name: "readme",
      file: {
        "readme": '## 时间范围选择（下拉框）\n通过两个下拉框选择时间\n## 安装\n```\nnpm install dropdown\n```\n### 场景\n在一个固定时间段内选择开始时间和结束时间；\n### API\n| 属性名 | 说明 | 类型 | 默认值 |\n| ------| ------ | ------ | ----- |\n|title|标题|string|请选择时间范围|\n|tips|时间范围说明|string|请选择最近一个月|\n### 代码展示\n```js\nimport React from "react";\nimport ReactDom from "react-dom";\nimport Dropdown from "./dropdown.js";\nReactDom.render(<Dropdown infor={{\n title: "学生列表",\n list: [\n { name: "张三", value: 1 },\n { name: "李四", value: 2 },\n { name: "王五", value: 3 }\n ]\n }}\n/>, document.getElementById("root"));\n```'
      }
    },
    {
      id: "1",
      name: "dropdown",
      file: {
        "./dropdown.js":
          'import React from "react";import "./index.css";export default class Dropdown extends React.Component {    constructor(props){        super(props);        this.state = {            visiable: false,            infor:  this.props.infor,                    }            }    componentDidMount(){        document.onclick = (e)=>{            if(this.state.visiable == true){                this.state.visiable = false;                this.forceUpdate();            }        }    }    render() {        var styleObj = {};        if(this.props.width) {            styleObj = {                width: this.props.width            }        }        return (<div className="dropdown" style={styleObj}><div className="dropbtn" onClick={(e)=>{                    e.stopPropagation();                    e.nativeEvent.stopImmediatePropagation();                    this.state.visiable = true;                    this.forceUpdate();                    }}>{this.state.infor.title}</div>                {<div className={this.state.visiable == false ? "dropdown-content" : "dropdown-content active"} >                        {                            this.state.infor.list.map((item, index)=>{                                return<a href="javascript:void(0)" className={this.state.infor.value == item.value ? "active" : null} key={index} onClick={(e)=>{                                    this.state.infor.title = item.name;                                    this.state.infor.value = item.value;                                    this.props.onChange && this.props.onChange(this.state.infor.value);                                    this.state.visiable = false;                                    this.forceUpdate();                                }}>{item.name}</a>                            })                        }</div>                }</div>        )    }}',
        "./index.css":
          ".dropbtn{font-family:Helvetica Neue For Number,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;background-color:#fff;background-image:url(./63d983faabb1e2cd0013de073d87d2e1.png);background-repeat:no-repeat;background-position:90%;padding:8px;padding-left:10px;border:1px solid #d9d9d9;border-radius:2px;text-align:center;cursor:pointer}.dropdown{display:inline-block;position:relative;width:150px;background:#fff}.dropdown-content{margin-top:2px;position:absolute;display:none;width:100%;height:150px;overflow-y:auto;z-index:1;border:1px solid #d9d9d9;box-sizing:border-box;-webkit-box-sizing:border-box;background:#fff}.dropdown-content a{color:#000;padding:4px 16px;text-decoration:none;display:block}.dropdown-content a:hover{color:fade(#000,65%);background-color:#eee}.dropdown-content a.active{color:#fff;background-color:#00f}.dropdown .dropdown-content.active{display:block;border-color:#00f}.dropdown.active .dropbtn,.dropdown:hover .dropbtn{border-color:#3697fd}"
        // ÷"./readme.md": "1. 登录\r\n2. 城市选择器\r\n3. Tab\r\n4. 翻页\r\n5. checkbox\r\n6. 左侧菜单\r\n7. 表格\r\n8. 表单\r\n10. 分布条\r\n11. 注册协议\r\n12. 下拉框\r\n13. 复制链接\r\n14. 日历范围选择器\r\n15. 面包屑\r\n### 组件调试方案\r\n* 功能：用户编写相关代码就可以实时运行代码;\r\n* 实现方法\r\n    * 通过eval方式运行代码;\r\n        * 准备条件是需要生成一个组件的JSON格式; （通过node工具进行生成）\r\n        * 是否要引入React、React-Dom和组件源文件: 需要（为了让用户更好明白代码逻辑）\r\n        * 库文件怎么加载？比如React、ReactDOM、moment库。\r\n        * 编辑器加载;\r\n* README文件预览\r\n    * 将README文件转为HTML文件；\r\n    * 然后给HTML文件增加样式;\r\n    * 给Code区域增加调试功能;\r\n```jsx\r\nimport React from 'react';\r\nimport \"../reset.css\";\r\nimport \"./nav.css\";\r\nexport default (props)=>{\r\n    return <div className=\"nav\" onClick={()=>{\r\n       props.onClick && props.onClick();\r\n    }}>{props.title || \"搜索\"}\r\n        <a className=\"back\" href=\"#\" onClick={(e)=>{\r\n     props.goBack &&  props.goBack(e); \r\n        }}></a>\r\n        <a className=\"home\" href=\"#\"></a>\r\n    </div>\r\n}\r\n```"
      },
      type: "0",
      depend: "",
      props: [
        {
          name: "title",
          label: "\u6807\u9898",
          type: "string"
        },
        { name: "icon", label: "\u6807\u7b7e\u7c7b\u578b", type: "string" },
        { name: "goBack", label: "\u8fd4\u56de\u4e8b\u4ef6", type: "event" }
      ]
    }
  ]
};
