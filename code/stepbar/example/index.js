import React from 'react';
import { render } from 'react-dom';
import Stepbar from "../lib";

class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height: 21
        };        
    }
    render(){
        return <Stepbar step={2} />
    }
}

render(<Test />, document.getElementById('root'));
