import React from 'react'
import './ContentList.css'

import { Collection } from 'react-materialize'

/**
 * @param type Array: ['photo', 'video', 'text']
 * @param index Number: '글번호?'
 * @param data JSON: { no, url, title, writer, regDate }
 */
const ContentItem = ( {type, data} )=>{
    return (
        <li className={`content-item ${type} ${data.no} collection-item avatar`}>
            <a style={{display:'block'}} href="#">
                <img src="/images/ygosu_logo.gif" alt="" className="circle"/>
                <span className="title" href={data.url}>{data.title}</span>
                <p>
                    <a className="writer">{data.writer}</a><br/>
                    <a className="regDate">{data.regDate}</a>
                </p>
                <a className="secondary-content">GO</a>
            </a>
        </li>
    )
}

/**
 * @param updated Array: [ { url, title, writer, regDate }, ... ]
 */
const Content = ({ type, updated })=>{
    const items = updated.map((data, index)=>{
        return <ContentItem key={index} type={type} data={data} />
    });
    return (
        <ul className={`content-list ${type} collection`}>
            { items.length > 0 ? items : null }
        </ul>
    )
}

Content.defaultProps = {
    updated: []
}

export default Content