import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql'

import dbConfig from './config/database.js'
import sessionConfig from './config/session.js'
import webpackDev from './config/webpack.dev.js'

import apiCrawler from './routes/crawler.js'

const app = express();

// Database
const conn = mysql.createConnection(dbConfig);
conn.connect();

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
app.use('/api', [ apiCrawler ] );

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