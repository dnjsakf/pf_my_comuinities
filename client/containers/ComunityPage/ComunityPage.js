import React from 'react'
import { connect } from 'react-redux'

import { getContent } from './../../actions/content.act.js'

import { ContentList } from './../../Components'
import { Row, Col, Icon, Input } from 'react-materialize'
import './ComunityPage.css'

const defaultProps = {
    location: "ComunityPage",
    board: { 
        info: {
            pagTitle: '',
            comTitle: '',
            bodTitle: ''
        },
        contents: [],
    },
    setting: {
        params:{
            commu: "ygosu",   // 시작페이지 가져오기
            board: "yeobgi",     // 시작페이지 가져오기
        },
        interval: 5000,
    }
}

class ComunityPage extends React.Component { 
    constructor(props){
        super(props);

        this.state = { 
            board: props.board,
            setting: props.setting
        }

        this.getContentHandler = this.getContentHandler.bind(this);
    }
    componentDidMount(){
        $('select').material_select();

        // 여기서 세션 체크하고, Props 받아올 때 getContent 실행
        
        this.getContentHandler( this.state.setting  );
    }
    
    getContentHandler( setting ){
        const that = this;
        setTimeout(function(){
            that.props.doGetContent( setting.params );
        }, setting.interval );
    }

    componentWillReceiveProps( nextProps ){
        console.log( nextProps );
        if( nextProps.board.status !== 'READY' ){
            this.setState(Object.assign({}, this.state,{
                board: {
                    doUpdate: nextProps.board.doUpdate,
                    info: nextProps.board.info,
                    contents: nextProps.board.contents.concat( this.state.board.contents )
                }
            }));
            this.getContentHandler( this.state.setting );
        }
    }
    componentWillUpdate( nextProps, nextState ){
        if( nextProps.board.status === 'SUCCESS' ) return true;
        return true;
    }

    render(){
        const search = (
            <div className={ `content t2` }>
                <div className="row" name="search-engine">
                    <select className="input-field col s2" type="select" name="condition">
                        <option value="title" selected>제목</option>
                        <option value="writer">작성자</option>
                    </select>
                    <input className="input-field col s9" type="text" name="input"/>
                    <a className="input-field col s1"><i className="material-icons small">search</i></a>
                </div>
            </div>
        )

        return (
            <div className={ `page ${ this.state.board.info.pagTitle }` }>
                <div>
                    <h5>{ this.state.board.info.comTitle }</h5>
                </div>
                <div>
                    { this.state.board.info.bodTitle }
                    { <ContentList contents={ this.state.board.contents } /> }
                </div>
            </div>
        );
    }
}
ComunityPage.defaultProps = defaultProps;

const mapStateToProps = ( state )=>{
    return {
        board: state.ContentReducer
    }
}
const mapDispatchToProps = ( dispatch )=>{
    return {
        doGetContent: ( params )=>{ dispatch( getContent( params ) ) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComunityPage)