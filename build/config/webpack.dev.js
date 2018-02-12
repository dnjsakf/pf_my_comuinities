'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackConfig = require('./../../webpack.config.js');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(host, proxyPort, devPort) {
    _webpackConfig2.default.entry.push('webpack-dev-server/client?http://' + host + ':' + devPort);
    _webpackConfig2.default.entry.push('webpack/hot/only-dev-server');
    _webpackConfig2.default.devtool = 'inline-source-map';

    var options = {
        hot: true,
        host: host,
        contentBase: './public',
        publicPath: '/',
        proxy: {
            "**": 'http://' + host + ':' + proxyPort
        }
    };

    _webpackDevServer2.default.addDevServerEntrypoints(_webpackConfig2.default, options);

    var devServer = new _webpackDevServer2.default((0, _webpack2.default)(_webpackConfig2.default), options);
    devServer.listen(devPort, host, function () {
        console.log('[webpack-dev] port:', devPort);
    });
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/config/webpack.dev.js');
}();

;