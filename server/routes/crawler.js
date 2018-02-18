// import express from 'express'
// import mysql from 'mysql'

// import DBConfig from './../config/database.js';
// import { crawler as SQL } from './../config/sql.js'
// import Crawler from './../utils/crawler.js'

const express = require('express');
const mysql = require('mysql');
const DBConfig = require('./../config/database.js');
const SQL = require('./../config/sql.js');
const Crawler = require('./../utils/crawler.js');

const app = express();

const conn = mysql.createConnection( DBConfig );
conn.connect();

const Router = express.Router();
const MEM_CODE = "mem@adm#1";
const COM_CODE = "com@ygo#2";
const BOD_CODE = "bod#1!com@ygo#2";

Router.get('/crawler/:comCode/:bodCode', (req, res)=>{
    const CONDITION = [ MEM_CODE, req.params.comCode, req.params.bodCode ];

    conn.query( SQL.crawler, CONDITION, function(error, result){
        if( error ) return res.status(500).json({ error: error });
        if( result.length === 0 ) return res.status(404).json({ error: "Not Found" });
        
        board = JSON.parse(JSON.stringify(result[0]));

        if( board.withLogin ){
            board.user = { "mb_id":"dnjsakf",  "mb_password":"wjddns1" }
        }

        const crawler = new Crawler( board );
        const crawling = (board.withLogin ? crawler.runWithLogin() : crawler.run());
        crawling.then((result)=>{
            console.log(`\n[${result.board.bodTitle}]`, result.pages, result.contents.length, result.updateData );
            
            if( result.updateData.length > 0 ){
                conn.query( SQL.updateLog, result.updateData, function(updateError, saved){
                    if( error ) return res.status(400).json({error:updateError});
                    return res.status(200).json({ contents: result.contents });
                });
            }
            res.status(200).json({ contents: result.contents });
        });
        crawling.catch((error)=>{
            res.status(400).json({error: error});
        });
    });
});

app.listen(3000, (req,res)=> console.log("[crawler server`]"));
app.use('/api', Router)

// export default Router;