import React, { PropTypes } from 'react'

class MainApp extends React.Component { 
    constructor(props){
        super(props);
    }
    render(){
        return (
            <h1>MainApp</h1>
        );
    }
}
MainApp.contextTypes = {
    //router: React.PropTypes.object
}
MainApp.defaultProps = {
    location: "MainApp"
}
export default MainApp