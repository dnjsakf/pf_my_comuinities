const conn = require('mysql').createConnection({
    host: 'localhost',
    user: 'heo',
    password: 'wjddns1',
    port: 3306,
    database: 'PF_MY_COMS'
});
conn.connect();

/**
 * Primary Key Pattern
 * 
 * 1. AAA@BBB#C : 기본
 * 2. AAA@BBB#C!DDD : 참조가 있는 경우
 * 3. AAA@BBB#C!DDD/EEE : 참조가 여러개인 경우
 * 
 * - AAA: Table명
 * - @BBB: Host, Uri, Title 등 Key를 제외한 구분자( 이건 테이블별로 명확하게 해줘야 할 듯)
 * - #C: Table Row - 혹시 모를 중복방지용ㅠ / Row 말고 iterator로 해도 될 듯
 * - !DDD: Reference Table의 BBB
 * - !DDD/EEE/...: !DDD의 반복
 */
const ADMIN_SQL = {
    "MEMBER": {
        "sql": [ 
            "INSERT INTO member",
            "( memCode, username, password, nickname, email )",
            "VALUES",
            "( ?, ?, ?, ?, ? )"
        ].join(" "),
        "conditions":[
            [ 'mem@adm#1', 'admin','1', 'heodlf' ,'dnjsakf@gmail.com' ]
        ]
    },
    "COMMUNITY": {
        "sql": [ 
            "INSERT INTO community",
            "( comCode, title, host, pageQuery, startPage )",
            "VALUES",
            "( ?, ?, ?, ?, ? )"
        ].join(" "),
        "conditions":[
            [ 'com@hum#1', '웃긴대학', 'http://web.humoruniv.com', '&pg=', 0 ],
            [ 'com@ygo#2', '와이고수', 'http://www.ygosu.com', '?page=', 1 ],
            [ 'com@gez#3', '개집넷', 'http://www.gezip.net', '&page=', 1 ]
        ]
    },
    "BOARD": {
        "sql": [
            "INSERT INTO board",
            "( bodCode, title, uri, withLogin, comCode )",
            "VALUES",
            "( ?, ?, ?, ?, ? )"
        ].join(" "),
        "conditions":[
            [ 'bod#1!com@hum#1', '웃긴유머', '/board/humor/list.html?table=pds', 0, 'com@hum#1' ],
            
            [ 'bod#1!com@ygo#2', '자유게시판', '/community/free', 0, 'com@ygo#2' ],
            [ 'bod#2!com@ygo#2', '엽기자랑', '/community/yeobgi', 0, 'com@ygo#2' ],

            [ 'bod#1!com@gez#3', '걸그룹', '/bbs/board.php?bo_table=girlgroup', 0, 'com@gez#3' ],
            [ 'bod#2!com@gez#3', '유머', '/bbs/board.php?bo_table=humor', 0, 'com@gez#3' ],
            [ 'bod#3!com@gez#3', '찰카닥', '/bbs/board.php?bo_table=sexy', 0, 'com@gez#3' ]
        ]
    },
    "PAGE": {
        "sql": [
            "INSERT INTO page",
            "( pagCode, title, memCode )",
            "VALUES",
            "( ?, ?, ? )"
        ].join(' '),
        "conditions":[
            [ 'pag#1!mem@adm#1' , '내 웃대', 'mem@adm#1' ],
            [ 'pag#2!mem@adm#1' , '와이고수', 'mem@adm#1' ],
            [ 'pag#3!mem@adm#1' , '개집', 'mem@adm#1' ]
        ]
    },
    "UPDATE_LOG": {
        "sql": [
            "INSERT INTO update_log",
            "( logCode, updated, memCode, bodCode )",
            "VALUES",
            "( ?, ?, ?, ? )"
        ].join(' '),
        "conditions":[
            [ 'log#1!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#1!com@hum#1' ],

            [ 'log#2!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#1!com@ygo#2' ],
            [ 'log#3!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#2!com@ygo#2' ],
            
            [ 'log#4!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#1!com@gez#3' ],
            [ 'log#5!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#2!com@gez#3' ],
            [ 'log#6!mem@adm#1' , '2018-02-15 18:00:00', 'mem@adm#1', 'bod#3!com@gez#3' ]
        ]
    },
    "PAGE_SETTING": {
        "sql": [
            "INSERT INTO page_setting",
            "( setCode, memCode, pagCode, comCode, bodCode, logcode )",
            "VALUES",
            "( ?, ?, ?, ?, ?, ?)"
        ].join(' '),
        "conditions":[
            [ 'set#1!mem@adm#1' , 'mem@adm#1', 'pag#1!mem@adm#1', 'com@hum#1', 'bod#1!com@hum#1', 'log#1!mem@adm#1' ],

            [ 'set#2!mem@adm#1' , 'mem@adm#1', 'pag#2!mem@adm#1', 'com@ygo#2', 'bod#1!com@ygo#2', 'log#2!mem@adm#1' ],
            [ 'set#3!mem@adm#1' , 'mem@adm#1', 'pag#2!mem@adm#1', 'com@ygo#2', 'bod#2!com@ygo#2', 'log#3!mem@adm#1' ],
            
            [ 'set#4!mem@adm#1' , 'mem@adm#1', 'pag#3!mem@adm#1', 'com@gez#3', 'bod#1!com@gez#3', 'log#4!mem@adm#1' ],
            [ 'set#5!mem@adm#1' , 'mem@adm#1', 'pag#3!mem@adm#1', 'com@gez#3', 'bod#2!com@gez#3', 'log#5!mem@adm#1' ],
            [ 'set#6!mem@adm#1' , 'mem@adm#1', 'pag#3!mem@adm#1', 'com@gez#3', 'bod#3!com@gez#3', 'log#6!mem@adm#1' ]
        ]
    }
}
const TABLE_NAME = "PAGE_SETTING";
const SQL = ADMIN_SQL[TABLE_NAME].sql;
const CONDITIONS = ADMIN_SQL[TABLE_NAME].conditions;

startQuery( SQL, CONDITIONS, 0, function(error, result){
    if( error ) return console.error(`[error ${result}]`, error);
    console.log( result );

    process.exit();
});
function startQuery( sql, conditions, index, callback ){
    if( conditions.length > index ){
        conn.query( sql, conditions[index], function(error, result){
            if( error ) callback( error, index );
            startQuery( sql, conditions, index+=1, callback );
        });
    } else {
        callback( null, 'success' );
    }
}
