import express from 'express'
import mysql from 'mysql'
import bcrypt from 'bcryptjs'

import DBConfig from './../config/database.js'
import SQL from './../config/sql.js'

import Crawler from './../utils/crawler.js'

const Router = express.Router();
const conn = mysql.createConnection( DBConfig );
conn.connect();

Router.get('/crawler/:comTitle/:bodTitle', (req, res)=>{
    if( !req.session.user ){
        return res.status(405).json({
            error: 'Invalid Access'
        });
    }
    const runCrawler = new Promise((resolve, reject)=>{
        const CONDITION = [ req.session.user.memCode, req.params.comTitle, req.params.bodTitle ];
        conn.query( SQL.crawler, CONDITION, function(select_error, exist){
            if( select_error ){
                return reject({
                    errorCode: 500, 
                    error: select_error
                });
            }
            if( exist.length === 0 ){
                return reject({
                    errorCode: 404, 
                    error: 'Not Found Page'
                });
            }
            resolve( JSON.parse(JSON.stringify(exist[0])) );
        });
    }).then(( chunk )=>{
        // Input User Cookie id/pwd
        return new Promise((resolve, reject)=>{
            // 유저에게 인풋으로 받던가, DB에서 가져오기
            // reject는 그 때 작성
            if( chunk.withLogin ){
                chunk.user = { "mb_id":"dnjsakf",  "mb_password":"wjddns1" }
            }
            
            resolve( chunk );    
        });
    }).then(( board )=>{
        // Create Crawler
        const crawler = new Crawler( board );
        return (board.withLogin ? crawler.runWithLogin() : crawler.run());
    }).then(( crawled )=>{
        // Crawling completed
        return new Promise((resolve, reject)=>{
            console.log(`\n[${crawled.board.bodTitle}]`, 
                        crawled.pages, 
                        crawled.contents.length, 
                        crawled.updateData );
            if( crawled.updateData ){
                conn.query( SQL.updateLog, crawled.updateData, function(error, updated){
                    if( error ){
                        return reject({
                            errorCode:400, 
                            error:error
                        });
                    }
                    resolve({
                        setCode: crawled.board.setCode,
                        contents: crawled.contents
                    });
                });
            } else {
                resolve({
                    setCode: crawled.board.setCode,
                    contents: []
                });
            }
        });
    }).then(( data )=>{
        // Save Session
        for(let index in req.session.page ){
            let board = req.session.page[index];
            if( board.setCode === data.setCode ){
                board.contents = data.contents;
            }
        }
        return res.status(200).json({
            board: data.board,
            contents: data.contents
        });
    }).catch(( error )=>{
        return res.status(error.errorCode).json(error);
    });
});

export default Router