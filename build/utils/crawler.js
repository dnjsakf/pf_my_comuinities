'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Parsing = require('./parsing.js');

var cheerio = require('cheerio');
var request = require('request');

var moment = require('moment');
var DATE = new Date();
var today = DATE.getFullYear() + '-' + DATE.getMonth() + '-' + DATE.getDate();

// Configuration
var UserAgent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
var ContentType = 'text/html; charset=utf-8';

var Crawling = function Crawling(board) {
    this.state = board;
    this.state.today = today;

    this.getBoardList = Parsing[this.state.comTitle].getBoardList;
    this.getContent = Parsing[this.state.comTitle].getContent.bind(this);
};
Crawling.prototype.getBoardURL = function () {
    return this.state.host + this.state.uri + this.state.pageQuery;
};
Crawling.prototype.run = function (callback) {
    var state = this.state;
    var boardURL = this.getBoardURL();
    this.scrapping(boardURL, state.startPage, function (error, pages, contents) {
        if (error) return callback(error);
        var needUpdate = contents.length > 0;
        callback(null, needUpdate, {
            board: state,
            pages: pages,
            contents: contents,
            contentId: needUpdate ? contents[contents.length - 1].no : null,
            update: needUpdate ? contents[contents.length - 1].regDate : null
        });
    });
};
Crawling.prototype.runWithLogin = function (callback) {
    var _this = this;

    var cookieJar = request.jar();
    var user = this.state.user;
    new Promise(function (resolve, reject) {
        // 이거 나중에 수정해야됨
        // 로그인 관련 테이블 만들어서 JOIN으로 가져오자
        var options = {
            url: 'http://gezip.net/bbs/login_check.php',
            method: 'post',
            form: user,
            jar: cookieJar,
            encodnig: 'utf-8',
            headers: {
                'User-Agent': UserAgent,
                'Content-Type': ContentType
            }
        };

        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(cookieJar);
        });
    }).then(function (cookie) {
        _this.cookieJar = cookie;
        _this.run(callback);
    }).catch(function (error) {
        return callback(error);
    });
};
Crawling.prototype.scrapping = function (boardURL, page, callback) {
    var options = {
        url: boardURL + page,
        jar: this.cookieJar,
        headers: {
            'User-Agent': UserAgent,
            'Content-Type': ContentType
        }
    };
    var req = request(options, function (error, response, body) {
        if (error) callback(error);
        if (response.statusCode === 200 || response.statusCode === 201) {
            var $ = cheerio.load(body);
            var $boardList = this.parser.getBoardList($);

            var contents = [];
            var content = null;
            var length = $boardList.length;

            for (var i = 0; i < length; i++) {
                var _content = this.parser.getContent($boardList.eq(i));
                if (!_content) {
                    break;
                }
                contents.push(_content);
            }
            if (contents.length > 0) {
                return this.scrapping(boardURL, page += 1, function (_error, _pages, _contents) {
                    if (!_error) _pages.push(page - 1);

                    callback(_error, _pages, contents.concat(_contents));
                });
            }
            callback(null, [], contents);
        } else {
            callback('Forbidden: response status ' + response.statusCode);
        }
    }.bind(this));
};

var _default = Crawling;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(DATE, 'DATE', 'server/utils/crawler.js');

    __REACT_HOT_LOADER__.register(today, 'today', 'server/utils/crawler.js');

    __REACT_HOT_LOADER__.register(UserAgent, 'UserAgent', 'server/utils/crawler.js');

    __REACT_HOT_LOADER__.register(ContentType, 'ContentType', 'server/utils/crawler.js');

    __REACT_HOT_LOADER__.register(Crawling, 'Crawling', 'server/utils/crawler.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/utils/crawler.js');
}();

;