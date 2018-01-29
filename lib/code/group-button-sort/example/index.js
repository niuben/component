import React from 'react';
import { render } from 'react-dom';
import GroupButtonSort from "../lib/index.js";

render(<GroupButtonSort list={[{
    name: "选项1",
    value: "0",
    order: "desc"
},{
    name: "选项2",
    value: "1",
    order: "desc"
}]} />, document.getElementById('root'));
