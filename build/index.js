'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _database = require('./config/database.js');

var _database2 = _interopRequireDefault(_database);

var _session = require('./config/session.js');

var _session2 = _interopRequireDefault(_session);

var _webpackDev = require('./config/webpack.dev.js');

var _webpackDev2 = _interopRequireDefault(_webpackDev);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Database
var conn = _mysql2.default.createConnection(_database2.default);
conn.connect();

// App Configuration
var app = (0, _express2.default)();
app.set('port', { "local": 8080, 'dev': 4000 });

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

// Error handler
app.use(function (error, req, res, next) {
  console.error('[throw-error]', error.stack);
  return res.status(500).json({
    error: error,
    next: next,
    code: 500,
    msg: "Something broken!!!"
  });
});

// Session
app.use(_session2.default);

// Set Route
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.use('/api', _routes2.default);

app.get('*', function (req, res, next) {
  if (req.path.split('/')[1] === 'static') return next();
  res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

// Production or Proxy
app.listen(app.get('port').local, function () {
  return console.log('[express] port:', app.get('port').local);
});

// Devlopment
if (process.env.NODE_ENV === 'development') {
  (0, _webpackDev2.default)('localhost', app.get('port').local, app.get('port').dev);
}
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(conn, 'conn', 'server/index.js');

  __REACT_HOT_LOADER__.register(app, 'app', 'server/index.js');
}();

;