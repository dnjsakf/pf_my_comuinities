import React, { PropTypes } from 'react'

import ComunityPage from './ComunityPage/ComunityPage.js'

class MainApp extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            session: {
                memCode: 'mem1',
                username: 'dnjsakf',
                nickname: '허돌프',
                regDate: '2018. 2. 12.',
                pageIndex: 0,
                comunities: ['com1','com2']
            },
            // 나중에 Reducer로 가져올것, setCode: ['setm1c1', 'setm1c2']
            setting:[
                {
                    title: 'ygosu',
                    url: 'http://www.ygosu.com',
                    board: {
                        '자유게시판':'/community/all_article'
                    },
                    contentType: ['text', 'photo'],
                    interval: 1
                }
            ]
        }
    }
    render(){
        return (
            <div>
                <header>
                    <h6>Header</h6>
                </header>
                <section>
                    <ComunityPage setting={ this.state.setting[0] } />
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