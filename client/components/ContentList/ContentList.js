import React from 'react'
import './ContentList.css'

/**
 * @param type Array: ['photo', 'video', 'text']
 * @param index Number: '글번호?'
 * @param data JSON: { no, url, title, writer, regDate }
 */
const ContentItem = ( {type, data} )=>{
    return (
        <li className={`content-item ${type} ${data.no}`}>
            <a className="title" href={data.url}>{data.title}</a>
            <a className="writer">{data.writer}</a>
            <a className="regDate">{data.regDate}</a>
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
        <ul className={`content-list ${type}`}>
            { items.length > 0 ? items : null }
        </ul>
    )
}

Content.defaultProps = {
    updated: []
}

export default Content