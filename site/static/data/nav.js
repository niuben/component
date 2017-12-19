var modules = {
  component: [
    {
      id: "0",
      name: "app",
      file: {
        "./app.js":
          'import React from "react";\nimport ReactDom from "react-dom";\nimport Nav from "./nav.js";\n ReactDom.render(<Nav />, document.getElementById("root"));'
      }
    },
    {
      id: "1",
      name: "nav",
      file: {
        "./nav.js":
          'import React from \'react\';\nimport "../reset.css";\nimport "./nav.css";\nexport default (props)=>{\n    return <div className="nav" onClick={()=>{\n       props.onClick && props.onClick();\n    }}>{props.title || "\u641c\u7d22"}\n        <a className="back" href="#" onClick={(e)=>{\n            props.goBack &&  props.goBack(e); \n        }}></a>\n        <a className="home" href="#"></a>\n    </div>\n}',
        "./nav.css":
          ".nav {\r\n    background-color:#424852;\r\n    text-align: center;\r\n    height: 45px;\r\n    line-height: 45px;\r\n    color: #FFF;\r\n    font-size: 18px;\r\n    font-weight: bold;\r\n    position: relative;\r\n    z-index: 15;\r\n}\r\n.nav a:focus{\r\n    background-color: #444;\r\n}\r\n\r\n/* ???? */\r\n.nav .back, .nav .home, .nav .search{\r\n    position: absolute;\r\n    top: 0px;\r\n    height: 23px;\r\n    width: 23px;\r\n    padding: 10px 15px;   \r\n    background-image: url(./topBarBg.png); \r\n    background-repeat: no-repeat;\r\n    /*background-position: 0 -33px;*/\r\n    background-size: 23px 197px;\r\n    background-clip: content-box;\r\n    -webkit-background-clip: content-box;    \r\n    background-origin: content;\r\n    -webkit-background-origin: content;\r\n}\r\n/* ?? */\r\n.nav .back, #topBar .back{    \r\n    left: 0px;\r\n    padding-left: 10px;\r\n    background-position: 0 -53px;\r\n}\r\n.nav .back:active, #topBar .back:active{    \r\n    background-position: 0 -79px;\r\n}\r\n\r\n/* ?? */\r\n.nav .home, #topBar .home{\r\n    right: 0px;\r\n    background-position: 0 0;\r\n    border: none;\r\n}\r\n.nav .home:active,.nav .home:hover, #topBar .home:active, #topBar .home:hover{\r\n    background-position: 0 -26px;\r\n    /*background-color: #444444;*/\r\n    /*background-color: transparent;*/\r\n}\r\n\r\n/* ???? */\r\n.nav .search{\r\n    top: 0px;\r\n    right: 0px;\r\n    background-position: 0 -106px;\r\n    /*background-color: transparent;*/\r\n}\r\n.nav .search:active,.nav .search:hover{\r\n    background-position: 0 -133px;\r\n    /*background-color: #444444;*/\r\n}\r\n"
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
