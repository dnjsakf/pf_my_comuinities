import React from 'react'

import { ContentList } from './../../Components'
import { Row, Col, Icon } from 'react-materialize'
import './communityPage.css'

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
        $('select#serach_condition').material_select();
    }
    render(){
        const contents = this.props.setting.contentType.map((type, index)=>{
            return (
                <div className={ `content ${type}` }>
                    <div>{ type }</div>
                    <Row>
                        <Col className="input-field" s={3}>
                            <select id="serach_condition" name="condition">
                                <option value="title" selected>제목</option>
                                <option value="writer">작성자</option>
                            </select>
                        </Col>
                        <Col className="input-field" s={7}>
                            <input id="search_input" type="text" name="input" />
                            <label for="search_input"/>
                        </Col>
                        <Col className="input-field" s={2}>
                            <Icon>search</Icon>
                        </Col>
                    </Row>
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