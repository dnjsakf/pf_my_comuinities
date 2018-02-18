'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var crawler = exports.crawler = ['SELECT', ['p.title pagTitle', 'c.title comTitle', 'b.title bodTitle', 'c.host host', 'b.uri uri', 'c.pageQuery pageQuery', 'c.startPage startPage', 'b.withLogin withLogin', 'l.content_id content_id', 'l.updated updated'].join(', '), 'FROM page_stting s', 'INNER JOIN community c ON s.comCode = c.comCode', 'INNER JOIN board b ON s.bodCode = c.bodCode', 'INNER JOIN page p ON s.pagCode = p.pagCode', 'INNER JOIN update_log l ON s.logCode = l.logCode', 'WHERE s.memCode = ? AND s.comCode = ?'];
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(crawler, 'crawler', 'server/config/sql.js');
}();

;