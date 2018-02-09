import React from "react";
import "./index.scss";

export default class Group extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
            value: null,
            list: this.props.list != undefined ? this.props.list : [{
                name: "选项1",
                value: "0",
                order: "desc"
            },{
                name: "选项2",
                value: "1",
                order: "desc"
            }]
        };
    }
    getClassName(item){
        if(item.checked == false || item.checked == undefined) {
            return null
        }else {
            return "active " + item.order;
        }
    }
    clear(){ //选中
        this.state.list.map((item)=>{
            item.checked = false;
        });
    }
    render() {
        return (
            <div className="group">                
                {
                    this.state.list.map((item, index)=>{
                        return <button key={index} className={this.getClassName(item)} onClick={(e)=>{
                            if(item.checked == true) {
                                item.order = item.order == "desc" ? "asc" : "desc"; 
                            }else{
                                this.clear();
                                item.checked = true;
                                item.order = "desc";
                            }
                            this.forceUpdate();
                            this.props.onChange && this.props.onChange({
                                orderType: item.order,
                                sort: item.value 
                            })
                        }}>{item.name}</button>
                    })
                }
            </div>
        )
    }
}