'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _database = require('./../config/database.js');

var _database2 = _interopRequireDefault(_database);

var _sql = require('./../config/sql.js');

var _sql2 = _interopRequireDefault(_sql);

var _crawler = require('./../utils/crawler.js');

var _crawler2 = _interopRequireDefault(_crawler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = _mysql2.default.createConnection(_database2.default);
conn.connect();

var Router = _express2.default.Router();
var MEM_CODE = "mem@adm#1";
var COM_CODE = "com@ygo#2";

Router.get('/crawler', function (req, res) {
    var CONDITION = [MEM_CODE, COM_CODE];
    conn.query(_sql2.default.crawler, CONDITION, function (error, result) {
        if (error) return console.error('[sql-error]', error);
        if (result.length === 0) return console.log('[not-found]');

        result = JSON.parse(JSON.stringify(result));

        var board = {};
        for (var _index in result) {
            board = result[_index];
            if (board.withLogin) {
                // 사용자에게 입력받도록 한다.
                // 로그인 패턴에 관련된 Table도 만들자
                board.user = { "mb_id": "dnjsakf", "mb_password": "wjddns1" };
            }

            var crawler = new _crawler2.default(board);
            board.withLogin ? crawler.runWithLogin(updateHandler) : crawler.run(updateHandler);
        }
    });
});

function updateHandler(error, needUpdate, complete) {
    if (error) return console.error('[' + index + ' scrap error]', error);
    console.log('\n[' + complete.board.bodTitle + ']', needUpdate, complete.pages, complete.contents.length, complete.contentId, complete.update);
    for (var _index2 in complete.contents) {
        console.log(complete.contents[_index2].no, complete.contents[_index2].title, complete.contents[_index2].regDate);
    }
}

var _default = Router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(updateHandler, 'updateHandler', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(conn, 'conn', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(Router, 'Router', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(MEM_CODE, 'MEM_CODE', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(COM_CODE, 'COM_CODE', 'server/routes/crawler.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/crawler.js');
}();

;