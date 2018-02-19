import React from 'react'
import './ContentList.css'

const ContentItem = ( {data} )=>{
    return (
        <li className={`content-item ${data.no} collection-item avatar`}>
            <a style={{display:'block'}} href={data.url}>
                <img src="/images/ygosu_logo.gif" alt="" className="circle"/>
                <span className="title">{data.title}</span>
                <p>
                    <a className="writer">{data.writer}</a><br/>
                    <a className="regDate">{data.regDate}</a>
                </p>
            </a>
            <a className="secondary-content">GO</a>
        </li>
    )
}

const ContentList = ({ contents })=>{
    const items = contents.map((data, index)=>{
        return <ContentItem key={index} data={data} />
    });
    return (
        <ul className={`content-list collection`}>
            { items.length > 0 ? items : null }
        </ul>
    )
}

ContentList.defaultProps = {
    contents: []
}

export default ContentList