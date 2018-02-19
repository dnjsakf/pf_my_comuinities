const Parsing = require('./parsing.js');

const cheerio = require('cheerio');
const request = require('request');

const moment = require('moment');
const DATE = new Date();
const today = `${DATE.getFullYear()}-${DATE.getMonth()+1}-${DATE.getDate()}`;

// Configuration
const UserAgent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
const ContentType = 'text/html; charset=utf-8'

const Crawling = function( board ){
    this.state = board;
    this.state.today = today;

    this.getBoardList = Parsing[this.state.comTitle].getBoardList;
    this.getContent = Parsing[this.state.comTitle].getContent.bind(this);
}
Crawling.prototype.getBoardURL = function(){
    return ( this.state.host + this.state.uri + this.state.pageQuery );
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
    const req = request( options, function(error, response, body){
        if( error ) callback(error);
        if( response.statusCode === 200 || response.statusCode === 201 ){
            const $ = cheerio.load(body);
            const $boardList = this.getBoardList( $ );

            let contents = [];
            let content = null;
            const length = $boardList.length;

            for(let i = 0; i < length; i++){
                const content = this.getContent( $boardList.eq(i) );
                if( !content ){
                    break;
                }
                contents.push(content);
            }
            if( contents.length > 0){
                return this.scrapping( boardURL, page+=1, ( _error, _pages, _contents)=>{
                    if(!_error) _pages.push( page-1 );

                    callback( _error, _pages, contents.concat( _contents ) );
                });
            } 
            callback( null, [], contents );
        } else {
            callback( `Forbidden: response status ${response.statusCode}` );
        }
    }.bind(this));
}

Crawling.prototype.run = function(){
    const that = this;
    const boardURL = this.getBoardURL();
    return new Promise((resolve, reject)=>{
        that.scrapping( boardURL, that.state.startPage, (error, pages, contents)=>{
            // if( error ) return callback( error );
            if( error ) reject({errorCode: 400, error: error});
            resolve({
                board: that.state,
                pages: pages,
                contents: contents,
                updateData: ( contents.length > 0 ? [
                    contents[0].no,         // contentId
                    contents[0].regDate,    // updated
                    that.state.logCode                           // logCode
                ] : null )
            })
        });
    });
}
Crawling.prototype.runWithLogin = function(){
    const cookieJar = request.jar();
    const user = this.state.user;
    new Promise((resolve, reject)=>{
        // 이거 나중에 수정해야됨
        // 로그인 관련 테이블 만들어서 JOIN으로 가져오자
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
            if( error ) reject( {errorCode:400, error: error, msg: "User cookie login error" } );
            resolve( cookieJar );
        });
    }).then((cookie)=>{
        this.cookieJar = cookie;
        return this.run();
    }).catch((error)=>{
        return new Promise().reject(error);
    });
}
// export default Crawling
module.exports = Crawling