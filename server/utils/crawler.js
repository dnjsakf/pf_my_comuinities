const cheerio = require('cheerio');
const request = require('request');
const moment = require('moment');
const Parsing = require('./../config/CommunityPattern.js');
const mysql = require('mysql');

const DATE = new Date();
const today = DATE.getFullYear() + "-" + (DATE.getMonth()+1) + "-" + DATE.getDate();

// Configuration
const UserAgent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
const ContentType = 'text/html; charset=utf-8'

const Crawling = function( board ){
    this.state = board;
    this.state.today = today;
    this.state.updated = new Date( this.state.updated ).getTime();
    console.log( this.state );
    this.parser = new Parsing( this.state );
}
Crawling.prototype.getBoardURL = function(){
    return ( this.state.host + this.state.uri + this.state.pageQuery );
}
Crawling.prototype.run = function( callback ){
    const state = this.state;
    const boardURL = this.getBoardURL();
    this.scrapping( boardURL, state.startPage, (error, pages, contents)=>{
        if( error ) return callback( error );
        const needUpdate = contents.length > 0;
        callback(null, needUpdate, {
            board: state,
            contents: contents,
            update: needUpdate ? contents[contents.length-1].regDate : null
        });
    });
}
Crawling.prototype.runWithLogin = function( callback ){
    const cookieJar = request.jar();
    const user = this.state.user;
    new Promise((resolve, reject)=>{
        const options = {
            url: 'http://gezip.net/bbs/login_check.php',
            method: 'post',
            form: user,
            jar: cookieJar,
            encodnig: 'utf-8',
            headers: {
                'User-Agent': UserAgent,
                'Content-Type': ContentType
            }
        }
        request(options, function(error, response, body){
            if( error ) reject(error);
            resolve( cookieJar );
        });
    }).then((cookie)=>{
        this.cookieJar = cookie;
        this.run( callback );
    }).catch(error=>callback(error));
}
Crawling.prototype.scrapping = function( boardURL, page, callback){
    const options = {
        url: boardURL+page,
        jar: this.cookieJar,
        headers: {
            'User-Agent': UserAgent,
            'Content-Type': ContentType
        }
    }
    console.log( options.url );
    const req = request( options, function(error, response, body){
        if( error ) callback(error);
        if( response.statusCode === 200 || response.statusCode === 201 ){
            const $ = cheerio.load(body);
            const $boardList = this.parser.getBoardList( $ );

            let contents = [];
            let content = null;
            const length = $boardList.length;
            // for(let i = $boardList.length-1; i >= 0; i--){
            for(let i = 0; i < length; i++){
                const content = this.parser.getContent( $boardList.eq(i) );

                if( content ){
                    contents.push( content );
                    continue;
                } else {
                    break;
                }
            }
            if( contents.length > 0){
                return this.scrapping( boardURL, page+=1, ( _error, _pages, _contents)=>{
                    if(!_error) _pages.push( page-1 );

                    callback( _error, _pages, _contents.concat( contents ) );
                });
            } 
            callback( null, [], contents );
        } else {
            callback( `Forbidden: response status ${response.statusCode}` );
        }
    }.bind(this));
}

// Server에 작성
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'heo',
    password: 'wjddns1',
    port: 3306,
    database: 'pf_my_coms'
});
conn.connect();

const MEM_CODE = "mem@adm#1";
const COM_CODE = "com@ygo#2";
const SQL = `
SELECT p.title pagTitle, c.title comTitle, b.title bodTitle,  c.host, b.uri, c.pageQuery, c.startPage, b.withLogin, l.updated
FROM page_setting s
INNER JOIN community c
ON s.comCode = c.comCode
INNER JOIN board b
ON s.bodCode = b.bodCode
INNER JOIN page p
ON s.pagCode = p.pagCode
INNER JOIN update_log l
ON s.logCode = l.logCode
WHERE s.memCode = ?
AND s.comCode = ?
`
const CONDITION = [ MEM_CODE, COM_CODE ];
conn.query( SQL, CONDITION, function(error, result){
    if( error ) return console.error('[sql-error]', error);
    if( result.length === 0 ) return console.log('[not-found]');
    
    result = JSON.parse(JSON.stringify(result));

    let board = {};
    for(let index in result ){
        board = result[index];
        if( board.withLogin ){
            // 사용자에게 입력받도록 한다.
            // 로그인 패턴에 관련된 Table도 만들자
            board.user = { "mb_id":"dnjsakf",  "mb_password":"wjddns1" }
        }
        const crawler = new Crawling( board );
        ( board.withLogin ? crawler.runWithLogin(handler) : crawler.run(handler) );
    }
});
function handler(error, needUpdate, complete){
    if( error ) return console.error( `[${index} scrap error]`, error );
    console.log(`[${complete.board.bodTitle}-complete]`, needUpdate, complete.contents.length, complete.update);

    // Set Update
}

function saveUpdate( comCode, list ){
    const SQL = 'UPDATE community SET ? where ?';
    const condition = [
        { "board_list": JSON.stringify(list) },
        { "comCode": comCode }
    ]
    conn.query(SQL, condition, function(error, result){
        if( error ) return console.error( "[update-error]",error );
        console.log( `[update-${result.changedRows > 0 ? 'success' : 'fail'}]`,  );

        console.log( complete.contents );
    });
}