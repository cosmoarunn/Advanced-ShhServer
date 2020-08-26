/**
 *  NodeJS-Express Main Server 
 *  
 * 
 * 
 *  
 *  Author : Arun Panneerselvam
 */

"use strict";
const _           = require('lodash')
const path        = require('path')
const http        = require('http')
const https       = require('https')
const fs          = require('fs')
const WebSocket   = require('ws')
const express     = require('express')
const request     = require('request')
const moment      = require('moment')
const morgan      = require('morgan')   
const cors        = require('cors')
const sessions    = require("client-sessions");
const exec        = require('child_process').exec;
const async       = require('async')
const config      = require('./config.js')
const corsOptions = (config.corsEnabled)?require('./helpers/cors-helper.js'):{}
const chalk       = require('chalk');

const CACHE_CONTROL = 'no-store, no-cache, must-revalidate, private'
console.log(chalk.yellow("Building SSH Server.."))

config.secure = true
/*
* SSL Server Params
*/
var options = {
    key     : config.sslOptions.key,      
    cert    : config.sslOptions.cert,
};

var port = config.port || 3014;

var app         = express();  
app.set('superSecret', config.superSecret);

app.use(express.urlencoded({ extended: true })); // use body parser to get info from POST and/or URL parameters
app.use(express.json());

if(config.corsEnabled)
  app.use(cors()); //Use of cors for allwoed origins 

app.disable('x-powered-by');
//console.log(servConfig)

// Add custom headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'https://allowedserver.com');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
/**
 *  The api Proxy - use api proxy as an added layer of security
 * 
const API_URL="https://165.22.35.93:3014/graphql"
const expressProxy = require('express-http-proxy');
const apiProxy = expressProxy(API_URL, { 
  proxyReqPathResolver: function (req) {
    return `/shhapi${req.path}`;
  }
});
app.use('/shhapi', apiProxy);
*/
/*
* The SESSION - store it in browser
*/
app.use(sessions({
  cookieName: 'shhAPIsessions', // cookie name dictates the key name added to the request object
  secret: config.superSecret , // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
      path: '/', // cookie will only be sent to requests under '/api'
      maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
      ephemeral: false, // when true, cookie expires when the browser closes
      httpOnly: true, // when true, cookie is not accessible from javascript
      secure: (config.secure)?true:false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));

console.log(chalk.white('Host local address found: ' + config.host_local || 'unknown'))
/* --------------------------------------------------
 *  Create the https server
 * --------------------------------------------------
 */
var server, verbose
var corsEnabled = (config.corsEnabled)?"(CORS Enabled)":""
  //const { createProxyMiddleware } = require('http-proxy-middleware');
  //const WS_TOKEN = "JKJn928=32487ASHHS" //generate a nonce here for security
 
  /*const wss = createProxyMiddleware('/', {
    server,
    target: 'wss://165.22.35.93:15001', // Where the WS stream goes
    // pathRewrite: {
    //  '^/websocket' : '/socket',        // rewrite path.
    //  '^/removepath' : ''               // remove path.
    // },
    changeOrigin: true,
    ws: true,
    headers: { token: WS_TOKEN }, // Token added here
    secure: true, // Needed for websocket resources served with 'wss://'
    logLevel: 'debug',
  });*/

/** 
 *  The Servers & Routes Initialization
 */
 var wss, gwss

  async.series({
      server: function(callback) { 
        try { 
          if(config.secure) { verbose = "Secure HTTPS Server"
            server =  https.createServer(options, app)
          } else { verbose = "HTTP Server"
            server = http.createServer(options, app)
          }  
          var params = { app, server }, gqlResults;  /* 
          //implementation to create seprate instance of graphql server and subscription
          const GQLServer = require('./graphql-server.js')
          require('./graphql-server.js')(params, function( response) { 
            gqlResults = response.results
          })
          gwss = gqlResults.results
          */
          wss = new WebSocket.Server({ server,  port: 3020 }); 
          callback(null, { server,  wss })
          
        }catch(e) { 
          callback(e, null)
        }
      }, 
      base: function(callback) { 
        var baseRoute = require('./routes/base.js')
        callback(null, baseRoute)
      },
      auth: function(callback) { 
        var authRoute = require('./routes/auth.js')
        callback(null, authRoute)
      },
      openvpn: function(callback){ 
        var params = { wss:  wss,  ssl: options } 
        try{ 
          require('./routes/openvpn.js')(params, function (err, router) { //console.log(router)
            callback(null,router)
          });
        }catch(e) { console.log(e)
          callback(e, null)
        }
        
      }
  }, function(error, results) {  //console.log(chalk.green("results: " + JSON.stringify(results)))
      if(error)  {  
         console.trace(error)
         process.exit(1)
      }
      server = results.server.server; //console.log(server)
      
      //console.log(results)
      if(results.base) app.use('/routes/base', results.base)
      if(results.auth) app.use('/auth', results.auth)
      if(results.openvpn) { 
        app.use('/openvpn', results.openvpn)  
      }

      server.listen(port, function(err){
        if(err) console.log(err.toString());
        console.log(chalk.green("🚀 " + verbose + " (CORS: "+config.corsEnabled+") listening at https://"+config.host_ip+":"  + port));
      });

      const ApolloServer = require('./apollo-server.js');
      ApolloServer.applyMiddleware({ app })
      ApolloServer.installSubscriptionHandlers(server) 

      /*server.on('connection', function connection(request, socket, head) { 
         authenticate(request, (err, client) => {
            if (err || !client) {
              socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
              socket.destroy();
              return;
            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
              wss.emit('connection', ws, request, client);
            });
          });
      })*/
      // Handler for the HTTP -> WS upgrade
      
  });

  function authenticate(req, cb) { 
    //const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
    console.log(req.headers)
    //if(req.headers.authorization !== '4290XFAEDSASDHa')
      return (true, false) 
    
  }
/* --------------------------------------------------
  *  Basic Route
  *
  * --------------------------------------------------
  */
app.get('/', cors(corsOptions), function(req, res) {
      res.send("<p>  Response from HTTPS server (CORS: "+config.corsEnabled+") running at https://"+config.host_ip+":"+config.port+"/</p>");
});





   