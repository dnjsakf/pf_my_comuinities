import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import dbConfig from './config/database.js'
import sessionConfig from './config/session.js'
import webpackDev from './config/webpack.dev.js'

const app = express();

// App Configuration
app.set('port', {"local":8080, 'dev':4000});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Error handler
app.use(function(error, req, res, next){
  console.error('[throw-error]', error.stack);
  return res.status(500).json({
    error: error,
    next: next,
    code: 500,
    msg: "Something broken!!!"
  });
});

// Session
app.use(sessionConfig);

// Set Route
app.use('/', express.static(path.join(__dirname, './../public')));
app.get('*', (req, res, next)=>{
  if( req.path.split('/')[1] === 'static') return next();
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Production or Proxy
app.listen(app.get('port').local, ()=>console.log('[express] port:', app.get('port').local));

// Devlopment
if(process.env.NODE_ENV === 'development'){
  webpackDev( 'localhost', app.get('port').local, app.get('port').dev );
}