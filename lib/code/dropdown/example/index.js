import "../lib/reset.css";
import React from 'react';
import { render } from 'react-dom';
import Dropdown from "../lib/index.js";


render(<Dropdown  infor={{title: "数字列表", list: [{
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
}]}} /> , document.getElementById('root'));