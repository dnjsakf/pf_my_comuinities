import React from 'react'

import { Content } from './../../Components'

class ComunityPage extends React.Component { 
    constructor(props){
        super(props);
        this.state = {  updated: {} }
        this.state.updated = { 
            photo:[
                {
                    no: 39326,
                    url: "http://www.ygosu.com/community/all_article/?bid=df&rno=39326",
                    title: "요원 1316장 시광헬",
                    writer: "던게만함",
                    regDate: "2018. 2. 12. 19:23:55"
                }
            ],
            text:[
                {
                    no: 1267645,
                    url: "http://www.ygosu.com/community/all_article/?bid=st&rno=1267645",
                    title: "확실히 아마는 프사기인게 신맵 테스트서 나옴ㅋㅋ",
                    writer: "철봉기염",
                    regDate: "2018. 2. 12. 19:38:05"
                }
            ],
            video:[]
        }
    }
    render(){
        return (
            <div className={ `page ${this.props.setting.title}` }>
                {
                    this.props.setting.contentType.map((type, index)=>{
                        return <Content type={type} updated={this.state.updated[type]}/>
                    })
                }
            </div>
        );
    }
}
ComunityPage.contextTypes = {
    //router: React.PropTypes.object
}
ComunityPage.defaultProps = {
    location: "ComunityPage"
}
export default ComunityPage