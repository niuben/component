import React from "react";
import "./index.scss";
import "./reset.css";

export default class Dropdown extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visiable: false,
            infor:  this.props.infor,            
        }        
    }
    componentDidMount(){
        document.onclick = (e)=>{
            if(this.state.visiable == true){
                this.state.visiable = false;
                this.forceUpdate();
            }
        }
    }
    render() {
        var styleObj = {};
        if(this.props.width) {
            styleObj = {
                width: this.props.width
            }
        }
        return (
            <div className="dropdown" style={styleObj}>
                <div className="dropbtn" onClick={(e)=>{
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    this.state.visiable = true;
                    this.forceUpdate();    
                }}>{this.state.infor.title}</div>
                {
                    <div className={this.state.visiable == false ? "dropdown-content" : "dropdown-content active"} >
                        {
                            this.state.infor.list.map((item, index)=>{
                                return <a href="javascript:void(0)" className={this.state.infor.value == item.value ? "active" : null} key={index} onClick={(e)=>{
                                    this.state.infor.title = item.name;
                                    this.state.infor.value = item.value;
                                    this.props.onChange && this.props.onChange(this.state.infor.value);
                                    this.state.visiable = false;
                                    this.forceUpdate();
                                }}>{item.name}</a>
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}