import express from 'express'
import mysql from 'mysql'
import bcrypt from 'bcryptjs'

import DBConfig from './../config/database.js'
import SQL from './../config/sql.js'

const Router = express.Router();

const conn = mysql.createConnection( DBConfig );
conn.connect();

Router.post('/auth/login', (req, res)=>{
    const username = validate.check( 'username', req.body.username );
    const password = validate.check( 'password', req.body.password );
    // Check Validate        
    if( !username || !password ){
        return res.status(500).json({
            error: 'Invalid Input Data'
        });
    }
    // Run Check
    const getMember = new Promise((resolve, reject)=>{
        conn.query( SQL.auth.getMember, [ username ], (error, exist_member)=>{
            if( error ){
                return reject({
                    errorCode: 400, 
                    error:error, 
                    msg: "Get Member Query Error"
                });
            }
            if( exist_member.length !== 1 ){
                return reject({
                    errorCode: 400, 
                    error:'Not Found Username'
                });
            }
            resolve( exist_member[0] );
        });
    }).then((member)=>{
        // Get My Pages
        return new Promise((resolve, reject)=>{
            if( !bcrypt.compareSync( password, member.password ) ){
                return reject({
                    errorCode: 401, 
                    error: 'Not Matched Password.'
                });
            }
            // Set Session
            const user = {
                memCode: member.memCode,
                username: member.username,
                nickname: member.nickname,
                email: member.email
            }
            conn.query( SQL.getMyPages, [ member.memCode ], (error, myPages)=>{
                if( error ){
                    return reject({
                        errorCode:400,
                        error: error
                    });
                }
                resolve({
                    user: user, 
                    page: JSON.parse(JSON.stringify(myPages))
                });
            });
        });
    }).then((data)=>{
        req.session.user = data.user;
        req.session.page = data.page;

        console.log('[ hello,', data.user.memCode,']');
        return res.redirect('/');
        
    }).catch((error)=>{
        return res.status(error.errorCode).json(error);
    });
});

Router.post('/auth/register', (req, res)=>{
    console.log( "[body]", req.body );
    if( req.session.user ){
        return res.status(405).json({
            errorCode: 405,
            error: 'Invalid Access'
        })
    }

    const username = validate.check( 'username', req.body.username );
    const password = validate.check( 'password', req.body.password );
    const nickname = validate.check( 'nickname', req.body.nickname );
    const email = validate.check( 'email', req.body.email );
    // Check Validate
    if( !username || !password || !nickname || !email ){
        return res.status(500).json({
            error: 'Invalid Input Data'
        });
    }

    const insertMember = new Promise((resolve, reject)=>{
        // Check Exist User
        conn.query( SQL.auth.getMember, [ username ], (error, exist_member)=>{
            if( error ){
                return reject({
                    errorCode: 400, 
                    error:error, 
                    msg:"Check Exist Query Error"
                });
            }
            if( exist_member.length > 0 ){
                return reject({
                    errorCode: 400, 
                    error: 'EIXST_MEMBER'
                });
            }
            resolve( false );
        });
    }).then(( exist )=>{
        return new Promise((resolve, reject)=>{
            // Get Member Count For MemCode
            conn.query( SQL.auth.getMemberCount, (error, members)=>{
                if( error ){
                    return reject({
                        errorCode:400, 
                        error:error
                    });
                }
                resolve( members[0].count )
            });
        });
    }).then(( count )=>{
        return new Promise((resolve, reject)=>{
            // Insert Member
            const memCode = `mem@${username.substring(0,3)}#${ count+1 }`
            const hashedPwd = bcrypt.hashSync( password , 8 );
            const CONDITIONS = [ memCode, username, hashedPwd, nickname, email ];
            conn.query( SQL.auth.insertMember, CONDITIONS, (error, inserted)=>{
                if( error ){
                    return reject({
                        errorCode: 400, 
                        error:error, 
                        msg:"Insert Member Query Error"
                    });
                }
                // Send Member
                resolve( true );
            });
        });
    }).then(( joined )=>{
        return res.redirect('/api/auth/login?register=success');
    }).catch((error)=>{
        return res.status(error.errorCode).json(error);
    });
});

Router.get('/auth/logout', (req, res)=>{
    if( req.session.user ){
        const memCode = req.session.user.memCode;
        req.session.destroy((error)=>{
            console.log('[ Good bye...',memCode,']');
            res.redirect('/');
        });
    } else {
        res.status(405).json({
            error: "Invalid Access"
        });  // Error Page
    }
});

// TODO: 다음에 제대로 만들기....
Router.post('/auth/update', (req, res)=>{
    const CONDITIONS = [
        bcrypt.hashSync(req.body.password, 8),
        'mem@adm#1'
    ]
    conn.query( SQL.auth.updatePassword, CONDITIONS, (error, result)=>{
        if( error ) return res.status(500).json({
            errorCode: 500,
            error:error
        });
        return res.status(200).json({
            result: result
        });
    });
});

// Service
const validate = {
    pattern:{
        // 최소 5자, 최대 12자 첫 글자는 문자
        username: /^[a-zA-Z]{1}[a-zA-Z0-9]{4,12}$/,
        // 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
        // 초소 2자, 최대 8자
        nickname: /^[a-zA-Z0-9가-힣]{2,12}$/,
        email: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i    
    },
    description:{
        username: '최소 5자, 최대 12자 첫 글자는 문자',
        password: '최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자',
        nickname: '초소 2자, 최대 8자',
        email: '기본 이메일 형식 ex) admin@gmail.com'    
    },
    check: function( type, text ){
        if( typeof text !== 'string' || text.length === 0 ){
            return false;
        }
        return this.pattern[type].test( text ) ? text : false;
    }
}

export default Router