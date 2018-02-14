const cheerio = require('cheerio');
const request = require('request');
const Parsing = require('./../config/CommunityPattern.js');
const mysql = require('mysql');

const DATE = new Date();
const today = DATE.getFullYear() + "-" + (DATE.getMonth()+1) + "-" + DATE.getDate();

const Crawling = function( state ){
    this.state = {
        title: state.title,
        host: state.host,
        pageQuery: state.pageQuery,
        board: state.board,
        today: today
    }
    this.state.board.update = new Date( this.state.board.update ).getTime();
    this.parser = new Parsing( this.state );
}
Crawling.prototype.run = function( callback ){
    const that = this;
    const boardURL = that.getBoardURL();
    that.scrapping( boardURL, 1, (error, pages, contents)=>{
        if( error ) return callback( error );
        callback(null,{
            board: that.state.board.name,
            contents:contents,
            update: contents[contents.length-1].regDate
        });
    });
}
Crawling.prototype.getBoardURL = function(){
    return ( this.state.host + this.state.board.uri + this.state.pageQuery );
}
Crawling.prototype.scrapping = function( boardURL, page, callback){
    const req = request(boardURL+page, function(error, response, body){
        if( error ) callback(error);
        if( response.statusCode === 200 || response.statusCode === 201 ){
            const $ = cheerio.load(body);
            const $boardList = this.parser.getBoardList( $ );
            const itemCount = $boardList.length;

            let contents = [];
            let content = null;
            for(let i=itemCount-1; i >=0; i--){
                const content = this.parser.getContent( $boardList.eq(i) );
                if( content ) contents.push( content );
            }
            if( contents.length > 0){
                return this.scrapping( boardURL, page+=1, ( _error, _pages, _contents)=>{
                    if(!_error) _pages.push( page-1 );

                    callback( _error, _pages, _contents.concat( contents ) );
                });
            } 
            callback( null, [], contents );
        }
    }.bind(this));
}


// Server에 작성
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'heo',
    password: 'wjddns1',
    port: 3306,
    database: 'PP'
});
conn.connect();

// select num from a where FIND_IN_SET(num, (select id from b)) > 0;
const sql_coms = 'SELECT communities FROM member WHERE ?';
const condition = [{username: 'admin'}];
conn.query( sql_coms, condition, function(error, result){
    if( error ) return console.error( '[sql-error]',error );
    if( result.length !== 1 ) return console.error('[invalid-user]');
    
    const coms = JSON.parse( result[0].communities );

    // Test: Single Community
    const comCode = coms[0];
    const sql_com_detail = 'SELECT * FROM community WHERE ?';

    // 쪼개기
    conn.query( sql_com_detail, [{ "comCode": comCode }], function(_error, _result ){
        if( _error ) return console.error( '[sql-error]', _error);
        if( _result.length !== 1 ) return console.error('[invalid-community]');

        const boardList = JSON.parse( _result[0].board_list );
        let state = {
            title: _result[0].title,
            host: _result[0].host,
            pageQuery: _result[0].pageQuery,
        }
        for(let index in boardList ){
            state.board = boardList[index];

            new Crawling( state ).run(function(error, complete){
                if( error ) return console.error( `[${index} scrap error]`, error );
                console.log( `[${index} scrap complete 0]`, complete.contents );

                // Update Last Crawling Time
                if( complete.contents.length > 0 ){
                    boardList[index].update = complete.update;
                    saveUpdate( comCode, boardList );
                }
            });
        }
    });
});

function saveUpdate( comCode, list ){
    const SQL = 'UPDATE community SET ? where ?';
    const condition = [
        { "board_list": JSON.stringify(list) },
        { "comCode": comCode }
    ]
    conn.query(SQL, condition, function(error, result){
        if( error ) return console.error( "[update-error]",error );
        console.log( `[update-${result.changedRows > 0 ? 'success' : 'fail'}]`,  );
    });
}