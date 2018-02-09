import React from "react";
import style from  "./index-conf.scss";
const title = [{
    name: "选择礼品",
    text: "1"
},{
  name: "填写信息",
  text: "2"
},{
  name: "核对信息",
  text: "3"
},{
  name: "提交成功",
  text: "4"
}];

export default class Title extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      step: 5
    };
    this.title = this.props.title || title; 
  } 
  nextstep(index) {

    if( this.state.step > index || this.state.step === title.length - 1 ) {
      return style.active + " " + style.current;
    } else if(this.state.step === index) {
      return style.current;
    } 
  }

  render() {
    return(
      <div className={style.stepBar}>
        <ul className={style.title + " " + style.clearfix}>
          {
              this.title.map((item, index) =>{
                return <li className={this.nextstep(index)} key={index}>
                  <div style={{position: "relative"}}>
                    <h3>{item.name}</h3>
                    <p>
                      <i>{item.text}</i>
                      <em></em>
                    </p>
                  </div>
              </li>
              })
          }
          </ul>
      </div>
    )
  }
}