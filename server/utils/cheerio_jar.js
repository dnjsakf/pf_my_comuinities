const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const jar = request.jar();
const user = {
    "mb_id": "dnjsakf",
    "mb_password": "wjddns1"
}
// Check Login
// const req = request({
//     url: 'http://gezip.net/bbs/login_check.php',
//     method: 'post',
//     form: user,
//     jar: jar
// }, function(error, response, body){
//     if( error ) return console.log( error );
//     if( response.statusCode === 200 ){
//         request(
//             {
//                 url:"http://gezip.net/bbs/board.php?bo_table=sexy",
//                 header: response.headers,
//                 jar: jar
//             },
//             function(error, response, in_body ){
//                 console.log( response );
//             }
//         )
//     }
// });

// require('http').createServer((request, response)=>{

// });

// req = request({
//     url:'http://web.humoruniv.com/board/humor/list.html?table=pds',
//     method: 'get',
//     jar:jar,
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
//     }
// }, function(err, res, body){
//     res.setEncoding('utf8');
//     console.log( body );
// });
