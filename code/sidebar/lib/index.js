import React from "react";
import "./index.scss";

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { tabName: "新手指南", id: 1 },
        { tabName: "业务合作", id: 2 },
        { tabName: "联盟结算", id: 3 }
      ],
      currentIndex: 1
    };
  }
  componentDidMount() {
    
  }
  //tab切换方法
  tabChoiced(id) {
    this.setState({
      currentIndex: id
    });
  }

  srHeight(){
    var sh = window.screen.height;
    var lh = sh - 80- 140;
    return lh;
  }

  render() {
    var _this = this;
    var isBox1Show = this.state.currentIndex == 1 ? "block" : "none";
    var isBox2Show = this.state.currentIndex == 2 ? "block" : "none";
    var isBox3Show = this.state.currentIndex == 3 ? "block" : "none";
    var tabList = this.state.tabs.map(
      
      function(item, index) {
        //遍历标签页，如果标签的id等于tabsid，那么该标签就加多一个active的className
        var tabStyle = item.id == this.state.currentIndex ? "active" : "";
        return (
          <li key={index} onClick={this.tabChoiced.bind(_this, item.id)} className={tabStyle}>
            <b></b>
            <span></span>
            <i>{item.tabName}</i>
          </li>
        );
      }.bind(_this)
    );
    return (
      <div className="wrap">
        <ul className="faq-left" style={{minHeight: this.srHeight()}}>{tabList}</ul>
        <div className="faq-right">
          <div className="tabText" style={{display: isBox1Show}}>
            1
          </div>

          <div className="tabText" style={{display: isBox2Show}}>
            2
          </div>

          <div className="tabText" style={{display: isBox3Show}}>
            3
          </div>
        </div>
      </div>
    );
  }
}
