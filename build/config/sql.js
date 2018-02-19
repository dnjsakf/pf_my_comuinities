'use strict';

// export const crawler = [
module.exports.crawler = ['SELECT', ['p.title pagTitle', 'c.title comTitle', 'b.title bodTitle', 'c.host host', 'b.uri uri', 'c.pageQuery pageQuery', 'c.startPage startPage', 'b.withLogin withLogin', 'l.content_id content_id', 'l.updated updated', 's.logCode logCode'].join(', '), 'FROM page_setting s', 'INNER JOIN community c ON s.comCode = c.comCode', 'INNER JOIN board b ON s.bodCode = b.bodCode', 'INNER JOIN page p ON s.pagCode = p.pagCode', 'INNER JOIN update_log l ON s.logCode = l.logCode', 'WHERE s.memCode = ? AND c.title = ? AND b.title = ?'].join(' ');

module.exports.updateLog = ['UPDATE update_log', 'SET', ['content_id = ?', 'updated = ?'].join(', '), 'WHERE logCode = ?'].join(' ');
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }
}();

;