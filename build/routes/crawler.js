'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _database = require('./../config/database.js');

var _database2 = _interopRequireDefault(_database);

var _sql = require('./../config/sql.js');

var _sql2 = _interopRequireDefault(_sql);

var _crawler = require('./../utils/crawler.js');

var _crawler2 = _interopRequireDefault(_crawler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = _express2.default.Router();
var conn = _mysql2.default.createConnection(_database2.default);
conn.connect();

Router.get('/crawler/:comTitle/:bodTitle', function (req, res) {
    if (!req.session.user) {
        return res.status(405).json({
            error: 'Invalid Access'
        });
    }
    var runCrawler = new Promise(function (resolve, reject) {
        var CONDITION = [req.session.user.memCode, req.params.comTitle, req.params.bodTitle];
        conn.query(_sql2.default.crawler, CONDITION, function (select_error, exist) {
            if (select_error) {
                return reject({
                    errorCode: 500,
                    error: select_error
                });
            }
            if (exist.length === 0) {
                return reject({
                    errorCode: 404,
                    error: 'Not Found Data'
                });
            }
            resolve(JSON.parse(JSON.stringify(exist[0])));
        });
    }).then(function (chunk) {
        // Input User Cookie id/pwd
        return new Promise(function (resolve, reject) {
            // 유저에게 인풋으로 받던가, DB에서 가져오기
            // reject는 그 때 작성
            if (chunk.withLogin) {
                chunk.user = { "mb_id": "dnjsakf", "mb_password": "wjddns1" };
            }

            resolve(chunk);
        });
    }).then(function (board) {
        // Create Crawler
        var crawler = new _crawler2.default(board);
        return board.withLogin ? crawler.runWithLogin() : crawler.run();
    }).then(function (crawled) {
        // Crawling completed
        return new Promise(function (resolve, reject) {
            console.log('\n[' + crawled.board.bodTitle + ']', crawled.pages, crawled.contents.length, crawled.updateData);
            if (crawled.updateData) {
                conn.query(_sql2.default.updateLog, crawled.updateData, function (error, updated) {
                    if (error) {
                        return reject({
                            errorCode: 400,
                            error: error
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
    }).then(function (data) {
        // Save Session
        for (var index in req.session.page) {
            var board = req.session.page[index];
            if (board.setCode === data.setCode) {
                board.contents = data.contents;
            }
        }
        return res.status(200).json({
            board: data.board,
            contents: data.contents
        });
    }).catch(function (error) {
        return res.status(error.errorCode).json(error);
    });
});

var _default = Router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Router, 'Router', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(conn, 'conn', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/crawler.js');
}();

;