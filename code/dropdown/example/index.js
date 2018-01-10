import "../lib/reset.css";
import React from 'react';
import { render } from 'react-dom';
import Dropdown from "../lib";

class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
             height: 21
        };        
    }
    render(){
        return <Dropdown  infor={{title: "时间列表", list: [{
            name: 1, 
            value: 1
        }, {
            name: 2, 
            value: 2
        }, {
            name: 3, 
            value: 3
        },{
            name: 4, 
            value: 4
        }, {
            name: 5, 
            value: 5
        }, {
            name: 6, 
            value: 6
        },{
            name: 7, 
            value: 7
        }, {
            name: 8, 
            value: 8
        }, {
            name: 9, 
            value: 9
        }]}} />
    }
}

render(<Test />, document.getElementById('root'));