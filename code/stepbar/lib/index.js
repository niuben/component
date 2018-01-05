import React from "react";
import "./index.scss";
import "./reset.scss";
const title = [{
  name: "步骤一",
  text: "1"
},{
  name: "步骤二",
  text: "2"
},{
  name: "步骤三",
  text: "3"
},{
  name: "步骤四",
  text: "4"
}];

export default class Title extends React.Component {
  constructor(props){
    super(props);
    this.title = this.props.title || title; 
  } 
  nextstep(index) {
   
    if( this.props.step > index || this.props.step === title.length - 1 ) {
      return 'active last'
    } else if(this.props.step === index) {
      return 'active'
    } 
  }

  render() {
    return(
      <div className="cartbar">
        <ul className="title clearfix">
        {
            this.title.map((item, index) =>{
              return <li key={index} className={ this.nextstep(index)}>
                <h3>{item.name}</h3>
                <p><i>{item.text}</i></p>
            </li>
            })
        }
        </ul>
      </div>
    )
  }
}