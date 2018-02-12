import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './../../webpack.config.js'

export default function( host, proxyPort, devPort ){
    config.entry.push(`webpack-dev-server/client?http://${host}:${devPort}`);
    config.entry.push('webpack/hot/only-dev-server');
    config.devtool = 'inline-source-map';
    
    const options = {
        hot: true,
        host: host,
        contentBase: './public',
        publicPath: '/',
        proxy: {
        "**": `http://${host}:${proxyPort}`
        }
    };
    
    WebpackDevServer.addDevServerEntrypoints(config, options);

    const devServer = new WebpackDevServer(webpack(config), options);
    devServer.listen(devPort, host, ()=>{
        console.log('[webpack-dev] port:', devPort);
    });
}