const cheerio = require('cheerio');
const request = require('request');
const Pattern = require('./../config/CommunityPattern.js');

const Crawling = function( state ){
    this.com = new Pattern(state);
}
Crawling.prototype.run = function(){
    let running = [];
    const that = this;
    const names = this.com.getBoardNames();
    for(let index in names ){
        const boardURL = this.com.getBoardURL( names[index] );
        running.push(
            new Promise((resolve, reject)=>{
                that.scrapping( boardURL, 1, (error, pages, contents)=>{
                    if( error ) reject( error );
                    resolve( {
                        board:names[index], 
                        contents:contents, 
                        lastUpdate:contents[contents.length-1].regDate}
                    );
                });
            })
        );
    }

    return running
}
Crawling.prototype.scrapping = function( boardURL, page, callback){
    const req = request(boardURL+page, function(error, response, body){
        if( error ) callback(error);
        if( response.statusCode === 200 || response.statusCode === 201 ){
            const $ = cheerio.load(body);
            const $boardList = this.com.getBoardList( $ );
            const itemCount = $boardList.length;

            let contents = [];
            let content = null;
            for(let i=itemCount-1; i >= 0; i--){
                const content = this.com.getContent( $boardList.eq(i) );
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

// 나중에 Database에서 가져올 것
const YGOSU = {
    name: "YGOSU",
    host: "http://www.ygosu.com",
    board: {
        "자유게시판":"/community/free",
        "엽기자랑":"/community/yeobgi"
    },
    pageQuery: "?page=",
    lastUpdate: new Date('2018-02-13 21:00').getTime()
}
const GEZIP = {
    name: "GEZIP",
    host: "http://www.gezip.net",
    board: {
        "걸그룹": "/bbs/board.php?bo_table=girlgroup",
        "찰카닥": "/bbs/board.php?bo_table=sexy",
        "유머": "/bbs/board.php?bo_table=homor"
    },
    pageQuery: "&page=",
    lastUpdate: new Date('2018-02-13 20:00').getTime()
}
const HUMORUNIV = {
    name: "HUMORUNIV",
    host: "http://web.humoruniv.com",
    board: {
        "웃긴유머":"/board/humor/list.html?table=pds"
    },
    pageQuery: "&pg=",
    lastUpdate: new Date('2018-02-13 21:40').getTime()  // 이건 게시판별로 나눠야할듯
}

// Server에 작성
const crawler = new Crawling(YGOSU);
const isRunning = crawler.run();
Promise.all(isRunning).then((result)=>{
    // 이 변수는 Session에 저장해 뒀다가 서버에서 가져오는 걸로
    console.log( "[lastUpdate]", result[0] );
}).catch((error)=>{
    console.log( error );
});
