'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _database = require('./../config/database.js');

var _database2 = _interopRequireDefault(_database);

var _sql = require('./../config/sql.js');

var _sql2 = _interopRequireDefault(_sql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = _express2.default.Router();

var conn = _mysql2.default.createConnection(_database2.default);
conn.connect();

Router.post('/auth/login', function (req, res) {
    var username = validate.check('username', req.body.username);
    var password = validate.check('password', req.body.password);
    // Check Validate        
    if (!username || !password) {
        return res.status(500).json({
            error: 'Invalid Input Data'
        });
    }
    // Run Check
    var getMember = new Promise(function (resolve, reject) {
        conn.query(_sql2.default.auth.getMember, [username], function (error, exist_member) {
            if (error) {
                return reject({
                    errorCode: 400,
                    error: error,
                    msg: "Get Member Query Error"
                });
            }
            if (exist_member.length !== 1) {
                return reject({
                    errorCode: 400,
                    error: 'Not Found Username'
                });
            }
            resolve(exist_member[0]);
        });
    }).then(function (member) {
        // Get My Pages
        return new Promise(function (resolve, reject) {
            if (!_bcryptjs2.default.compareSync(password, member.password)) {
                return reject({
                    errorCode: 401,
                    error: 'Not Matched Password.'
                });
            }
            // Set Session
            var user = {
                memCode: member.memCode,
                username: member.username,
                nickname: member.nickname,
                email: member.email
            };
            conn.query(_sql2.default.getMyPages, [member.memCode], function (error, myPages) {
                if (error) {
                    return reject({
                        errorCode: 400,
                        error: error
                    });
                }
                resolve({
                    user: user,
                    page: JSON.parse(JSON.stringify(myPages))
                });
            });
        });
    }).then(function (data) {
        req.session.user = data.user;
        req.session.page = data.page;

        console.log('[ hello,', data.user.memCode, ']');
        return res.redirect('/');
    }).catch(function (error) {
        return res.status(error.errorCode).json(error);
    });
});
Router.post('/auth/register', function (req, res) {
    console.log("[body]", req.body);

    var username = validate.check('username', req.body.username);
    var password = validate.check('password', req.body.password);
    var nickname = validate.check('nickname', req.body.nickname);
    var email = validate.check('email', req.body.email);
    // Check Validate
    if (!username || !password || !nickname || !email) {
        return res.status(500).json({
            error: 'Invalid Input Data'
        });
    }

    var insertMember = new Promise(function (resolve, reject) {
        // Check Exist User
        conn.query(_sql2.default.auth.getMember, [username], function (error, exist_member) {
            if (error) {
                return reject({
                    errorCode: 400,
                    error: error,
                    msg: "Check Exist Query Error"
                });
            }
            if (exist_member.length > 0) {
                return reject({
                    errorCode: 400,
                    error: 'EIXST_MEMBER'
                });
            }
            resolve(false);
        });
    }).then(function (exist) {
        return new Promise(function (resolve, reject) {
            // Get Member Count For MemCode
            conn.query(_sql2.default.auth.getMemberCount, function (error, members) {
                if (error) {
                    return reject({
                        errorCode: 400,
                        error: error
                    });
                }
                resolve(members[0].count);
            });
        });
    }).then(function (count) {
        return new Promise(function (resolve, reject) {
            // Insert Member
            var memCode = 'mem@' + username.substring(0, 3) + '#' + (count + 1);
            var hashedPwd = _bcryptjs2.default.hashSync(password, 8);
            var CONDITIONS = [memCode, username, hashedPwd, nickname, email];
            conn.query(_sql2.default.auth.insertMember, CONDITIONS, function (error, inserted) {
                if (error) {
                    return reject({
                        errorCode: 400,
                        error: error,
                        msg: "Insert Member Query Error"
                    });
                }
                // Send Member
                resolve(true);
            });
        });
    }).then(function (joined) {
        return res.redirect('/api/auth/login?register=success');
    }).catch(function (error) {
        return res.status(error.errorCode).json(error);
    });
});

Router.get('/auth/logout', function (req, res) {
    if (req.session.user) {
        var memCode = req.session.user.memCode;
        req.session.destroy(function (error) {
            console.log('[ Good bye...', memCode, ']');
            res.redirect('/');
        });
    } else {
        res.status(405).json({
            error: "Invalid Accept"
        }); // Error Page
    }
});

Router.post('/auth/update', function (req, res) {
    var CONDITIONS = [_bcryptjs2.default.hashSync(req.body.password, 8), 'mem@adm#1'];
    conn.query(_sql2.default.auth.updatePassword, CONDITIONS, function (error, result) {
        if (error) return res.status(500).json({
            errorCode: 500,
            error: error
        });
        return res.status(200).json({
            result: result
        });
    });
});

// Service
var validate = {
    pattern: {
        // 최소 5자, 최대 12자 첫 글자는 문자
        username: /^[a-zA-Z]{1}[a-zA-Z0-9]{4,12}$/,
        // 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
        // 초소 2자, 최대 8자
        nickname: /^[a-zA-Z0-9가-힣]{2,12}$/,
        email: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    },
    check: function check(type, text) {
        if (typeof text !== 'string' || text.length === 0) {
            return false;
        }
        return this.pattern[type].test(text) ? text : false;
    }
};

var _default = Router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Router, 'Router', 'server/routes/auth.js');

    __REACT_HOT_LOADER__.register(conn, 'conn', 'server/routes/auth.js');

    __REACT_HOT_LOADER__.register(validate, 'validate', 'server/routes/auth.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/auth.js');
}();

;