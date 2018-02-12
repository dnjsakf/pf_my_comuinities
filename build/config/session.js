"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _expressSession2.default)({
    secret: "dolf@@c(*@_ASD",
    resave: false,
    saveUninitialized: true
});

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, "default", "server/config/session.js");
}();

;