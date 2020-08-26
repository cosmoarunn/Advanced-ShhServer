'use strict';
const path = require('path')
const fs = require('fs')
const Promise = require('promise')
const jwt = require('jsonwebtoken')
const isEmail = require('isemail')
const config = require(path.resolve(__dirname, './config.js'))
const { ApolloServer, PubSub } = require('apollo-server-express')
 
const context = require('./graphql/context.js')
// To-do : load these from directories recursively!!
  const typeDefs = require('./graphql/schemas/OvpnSchema.js')
  const resolvers =  require('./graphql/resolvers/OvpnResolver.js')
      
  const AuthAPI = require('./graphql/dataSources/AuthDataSource.js')
  const OvpnAPI = require('./graphql/dataSources/OpenVpnDataSource.js')
  const UserAPI = require('./graphql/dataSources/UserDataSource.js')

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//The verifier promise
let verifier = Promise.resolve()
//Sequelize store
const { createStore } = require('./graphql/utils');
const store = createStore(); 

//Parse authorization bearer
const parseBearer = (bearer) => { 
    const match = /^Bearer (.*)$/i.exec(bearer || '')
    return match ? match[1] : null
}
const autoCall = (fn, ...context) => {
  if (typeof fn === 'function') return fn(...context)
  return fn
};

//The pubsub object 
let pubsub
// Realtime subscriptions
pubsub = require('./graphql/pubsub.js')
if (!pubsub) pubsub = new PubSub()
/**
 * Validate auth_token
 */
const validateToken = (token, callback=null) => { //console.log(token); return;
  const verify = new Promise(resolve => { // console.log("verifying token : " + token)
    try{
      var privateKey = fs.readFileSync(path.resolve(__dirname, '../ssh/server.crt'))
      jwt.verify(token, privateKey, { algorithm: 'RS256' }, async function(err, decoded) { //console.log(decoded);
        var _email = (decoded && decoded.email) ? decoded.email: null
        if(_email) { 
          const userAPI = new UserAPI({ store })
          const users = await userAPI.findOrCreateUser({ _email });
          var _user = users && users[0] || null
          callback(null, { authToken: token, email: _email, user: _user} )
        }
      })
    } catch(e) {  console.trace(e);  callback(e, null) }   
  });
  verifier.then(() => verifier = verify(token)) //Do the verification and get user
};    
//get context
  const getContextFromHttpRequest = async (_req) => { console.log('req headers:'); // console.log(_req.headers)
  if(!_req || !_req.headers) return; 
    return validateToken(parseBearer(_req.headers.authorization), function(err,res) { //console.log(res)
      return { authToken: res.authToken, email: res.email, user: res.user }
    })
  }; 
//The ApolloServer Object
module.exports = new ApolloServer({ 
  typeDefs, 
  resolvers,
  tracing: true,
  cacheControl: true,
  engine: {    
    reportSchema: false
  },
  //The context 
  context: async ({ req, connection }) => {  //console.log(req)
  let contextData
    // simple auth check on every request
    //var authToken , email, user = null, authorized = false;
    try { 
      const _cData = await getContextFromHttpRequest((!connection)?req:connection); 
      if(!connection) contextData = await autoCall(context, { req })
      else contextData = await autoCall(context, { connection })
    }catch(e) {
      console.error(e)
      throw e
    }
    contextData = Object.assign({}, contextData, { pubsub }) //, {authToken, email})
    return contextData
  },
  //The subscription
  subscriptions: { 
    onConnect: async (connection, webSocket) => {  
     let contextData = {} , token =  connection.Authorization || connection.headers.Authorization  
     console.log(parseBearer(token))
        try {
          const _cData = validateToken(parseBearer(token), function(err,res) { console.log(err)
            return { authToken: res.authToken, email:res.email, user: res.user }
          })
          contextData = await autoCall(context, { connection, webSocket})
          contextData = Object.assign({}, contextData, { pubsub }, _cData)
        } catch (e) {
          console.trace(e)
          throw new Error('Missing auth token!')
        } 
    },
  },
  //The datasources
  dataSources: () => ({
    authAPI: new AuthAPI(),
    userAPI: new UserAPI({ store }),
    ovpnAPI: new OvpnAPI(),
  }),

});