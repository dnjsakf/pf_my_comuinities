import React, { PropTypes } from 'react'

import ComunityPage from './ComunityPage/ComunityPage.js'

class MainApp extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            session: {
                isLogined: true,
                username: "admin",
                memCode: "mem@adm#1"
            }
        }
    }
    // TODO: session get/set

    render(){
        return (
            <div>
                <header>
                    <a>{ this.state.session.username }</a>
                </header>
                <section>
                    {/* 여기는 뭐 페이지 몇개 보여줄지 설정해주면 됨. memCode는 reducer로 처리*/}
                    <ComunityPage session={ this.state.session } />
                </section>
            </div>
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