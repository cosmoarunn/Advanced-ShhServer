const path        = require('path');
const express     = require('express');
const fs          = require('fs');

const Promise     = require('promise');
const request     = require('request');
const cors        = require('cors');

const jwt         = require('jsonwebtoken');

const config      = require('../config.js')
const rHelper     = require('../helpers/router-helper.js')
const fHelper     = require('../helpers/file-helper.js') 
//Route
const AuthRouter   = express.Router();

/*
* Cors Options
*/ 
var whitelist = config.allowedOrigins //
//console.log(whitelist);
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            console.log(origin)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200,
    //origin: "*:*"
}

    //A Simple get to auth
    AuthRouter.get('/', cors(),function(req, res) { 
    var ip = rHelper.getIP(req)
      res.json({success: true, msg: "auth router received your request and responds hello!", data: {} })
    })

    AuthRouter.get('/user', cors(), function(req, res) { 
      var ip = rHelper.getIP(req)
      var params = req.query
      res.json({success: false, msg: "User or email never signed up!", response:{error: false, data: params} })
        
    })

    AuthRouter.get('/getToken', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
      var token=null, params = req.query
      
        //  res.json(params)
      if(params.email && params.password)  { 
        if(params.email !== "aeroarunn@gmail.com" && params.password !== "sgpajsep2") {   //do email-password auth check with server
          res.json({success: false, msg: "User or email never signed up!", response:{error: true, token: undefined} })
        } 
        var privateKey = fs.readFileSync(path.resolve('../shhServer/ssh/key.pem'))
      
        jwt.sign({ email: params.email, password: params.password }, privateKey, { algorithm: 'RS256', expiresIn: '24h' }, function(err, token) { console.log(token)
          res.json({success: true, msg: "Authorization successful, Token generated!", response:{error: err, token: token} })
        }); 
      }

     

        
          
    })

    //A Simple 'hello' get
    AuthRouter.get('/validateToken', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
        res.json({success: true, msg: "Hello from the auth router!" })
    })

    //A Simple get for JSON file
    AuthRouter.get('/api-test', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
        var jsonApi = JSON.parse(fs.readFileSync(path.resolve('./test.json')))
        res.json({success: true, msg: JSON.stringify(jsonApi) })
          
    })
    //A Simple post
    AuthRouter.post('/post-auth', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
      rHelper.parseRequest(req, function(isJSON, data) { 
        var body = (isJSON)?JSON.stringify(data):data
        res.json({success: true, msg: "Post request to auth", body: body })
      });
      
    })

module.exports = AuthRouter
