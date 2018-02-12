import React from 'react'

import { ContentList } from './../../Components'
import { Row, Col, Icon, Input } from 'react-materialize'
import './ComunityPage.css'

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
    componentDidMount(){
        $('select').material_select();
    }
    render(){
        const contents = this.props.setting.contentType.map((type, index)=>{
            return (
                <div className={ `content ${type} t2` }>
                    <h6>{ type }</h6>
                    <div className="row">
                        <select className="input-field col s2" type="select" name="condition">
                            <option value="title" selected>제목</option>
                            <option value="writer">작성자</option>
                        </select>
                        <input className="input-field col s9"type="text" name="input"/>
                        <a className="input-field col s1"><i className="material-icons small">search</i></a>
                    </div>
                    <ContentList type={type} updated={this.state.updated[type]}/>
                </div>
            )
        });

        return (
            <div className={ `page ${this.props.setting.title}` }>
                <div>
                    <h5>{this.props.setting.title}</h5>
                </div>
                { contents }
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