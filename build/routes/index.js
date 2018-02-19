'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crawler = require('./crawler.js');

var _crawler2 = _interopRequireDefault(_crawler);

var _auth = require('./auth.js');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_crawler2.default, _auth2.default];
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/index.js');
}();

;