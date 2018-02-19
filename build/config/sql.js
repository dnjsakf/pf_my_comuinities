'use strict';

/**
 * getMyPages: 로그인 성공시 가져올 데이터
 * @ 페이지에 대한 기본 셋팅( setCode, title, layout )
 */
module.exports.getMyPages = ['SELECT', ['s.setCode setCode',
// For Page Layout
's.layout layout', 'p.page_index page_index', 's.board_index board_index',
// For Page Display
'p.title pagTitle', 'c.title comTitle', 'b.title bodTitle'].join(', '), 'FROM page_setting s',
// JOIN
'INNER JOIN page p ON s.pagCode = p.pagCode', 'INNER JOIN community c ON s.comCode = c.comCode', 'INNER JOIN board b ON s.bodCode = b.bodCode',
// CONDITIONS
'WHERE s.memCode = ?', 'AND p.display = 1 AND s.display = 1'].join(' ');
/**
 * crawler: 세션에서 
 */
module.exports.crawler = ['SELECT', [
// For Save Session
's.setCode setCode',
// For Title
'c.title comTitle', 'b.title bodTitle',
// For URL
'c.host host', 'b.uri uri', 'c.pageQuery pageQuery', 'c.startPage startPage',
// For Authentication
'b.withLogin withLogin',
// For Crawling
'l.content_id content_id', 'l.updated updated',
// For Update
's.logCode logCode'].join(', '), 'FROM page_setting s',
// JOIN
'INNER JOIN page p ON s.pagCode = p.pagCode', 'INNER JOIN community c ON s.comCode = c.comCode', 'INNER JOIN board b ON s.bodCode = b.bodCode', 'INNER JOIN update_log l ON s.logCode = l.logCode',
// CONDITIONS
'WHERE s.memCode = ?', 'AND c.title = ?', 'AND b.title = ?'].join(' ');
/**
 * updateLog: 크롤링 한 후 가장 최신 글의 ID값을 저장
 */
module.exports.updateLog = ['UPDATE update_log', 'SET', ['content_id = ?', 'updated = ?'].join(', '), 'WHERE logCode = ?'].join(' ');

/**
 * Auth
 */
module.exports.auth = {
    getMemberCount: 'SELECT count(*) count FROM member',
    getMember: 'SELECT * FROM member WHERE username = ?',
    insertMember: ['INSERT INTO member', '( memCode, username, password, nickname, email )', 'VALUES', '( ?, ?, ?, ?, ? )'].join(' '),
    updatePassword: 'UPDATE member SET password = ? where memCode = ?'
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }
}();

;