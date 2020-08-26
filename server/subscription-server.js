const _ = require('lodash')
const config = require('./config.js')
const Promise     = require('promise');
const chalk = require('chalk')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } =  require('subscriptions-transport-ws')

/**
 * SubscriptionServer Object
 */
var SubsServer = function() { 
    
    this.error = {}
    _.bindAll(this)
}

SubsServer.prototype.createSubScriptionServer = function(server, Schema) { 
  console.log(chalk.yellow("creating subscription server at wss://"+config.host_ip+":"  + config.port +"/graphiql"))
     
  var subscriptionServer
  try { 
    subscriptionServer = new SubscriptionServer( 
    {
      execute,
      subscribe,
      schema: Schema,
      onConnect: connectionParams => {
        console.log('onConnect');
        console.log({ label: connectionParams, msg: connectionParams });
        return connectionParams;
      },
      onOperation: (message, params) => {
        console.log('onOperation');
        return {
          ...params,
          context: {
            ...params.context
          }
        };
      },
      onOperationComplete: () => {
        console.log('onOperationComplete');
      },
      onDisconnect: () => {
        console.log('onDisconnect');
      }
    },
    {
      server,
      //secure: true,
      //port: config.graphql.wssPort,
      path: config.graphql.subsPath,
    }
  ); 
    return { success: true, msg:"Subscription server created!", results: subscriptionServer }
  }catch(e) { console.trace(e)
    console.log(chalk.red("Error creating subscription server"))
    return { success: false, msg:"Subscription server creation failed!", results: e }
  }
  
}

    


//Testing
Object.defineProperty(SubsServer.prototype, "self", {
    get: function () {
        return this;
    },
    enumerable: false,
    configurable: true
});


  module.exports = (server, schema, cb) => { 
    var subsServer = new SubsServer()
       cb(subsServer.error, subsServer.createSubScriptionServer(server,schema))

  }