import "../lib/reset.scss";
import React from 'react';
import { render } from 'react-dom';
import RangeSelect from "../lib";

class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height: 21
        };        
    }
    render(){
        return <RangeSelect />
    }
}

render(<Test />, document.getElementById('root'));
