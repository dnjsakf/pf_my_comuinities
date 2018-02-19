'use strict';

// import express from 'express'
// import mysql from 'mysql'

// import DBConfig from './../config/database.js';
// import { crawler as SQL } from './../config/sql.js'
// import Crawler from './../utils/crawler.js'

var express = require('express');
var mysql = require('mysql');
var DBConfig = require('./../config/database.js');
var SQL = require('./../config/sql.js');
var Crawler = require('./../utils/crawler.js');

var app = express();

var conn = mysql.createConnection(DBConfig);
conn.connect();

var Router = express.Router();
var MEM_CODE = "mem@adm#1";
var COM_CODE = "com@ygo#2";
var BOD_CODE = "bod#1!com@ygo#2";

Router.get('/crawler/:comCode/:bodCode', function (req, res) {
    var CONDITION = [MEM_CODE, req.params.comCode, req.params.bodCode];

    conn.query(SQL.crawler, CONDITION, function (selectError, selected) {
        if (selectError) return res.status(500).json({ error: selectError });
        if (selected.length === 0) return res.status(404).json({ error: "Not Found" });

        board = JSON.parse(JSON.stringify(selected[0]));

        if (board.withLogin) {
            board.user = { "mb_id": "dnjsakf", "mb_password": "wjddns1" };
        }

        var crawler = new Crawler(board);
        var crawling = board.withLogin ? crawler.runWithLogin() : crawler.run();
        crawling.then(function (result) {
            console.log(result);
            console.log('\n[' + result.board.bodTitle + ']', result.pages, result.contents.length, result.updateData);
            if (result.updateData) {
                conn.query(SQL.updateLog, result.updateData, function (updateError, updated) {
                    if (updateError) return res.status(400).json({ error: updateError });
                    res.status(200).json({
                        board: board,
                        contents: result.contents
                    });
                });
            } else {
                res.status(200).json({
                    board: board,
                    contents: result.contents
                });
            }
        });
        crawling.catch(function (crawlingError) {
            res.status(400).json({ error: crawlingError });
        });
    });
});

app.listen(3000, function (req, res) {
    return console.log("[crawler server`]");
});
app.use('/api', Router);

// export default Router;

;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(app, 'app', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(conn, 'conn', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(Router, 'Router', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(MEM_CODE, 'MEM_CODE', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(COM_CODE, 'COM_CODE', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(BOD_CODE, 'BOD_CODE', 'server/routes/crawler.js');
}();

;