const _ = require('lodash')
const Promise     = require('promise');
const chalk = require('chalk')
const merge = require('deepmerge')
const ApolloServer = require('./apollo-server.js');
const config = require('./config.js')
const Schema = require('./graphql/schemas/OvpnSchema.js')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')

/**
 * GraphQLServer Object
 */
var GraphQLServer = function() { 
    this.host = ""
    this.endpointURL = ""
    this.endpointGraphiQlURL = ""
    this.port = null
    this.error = {}

    _.bindAll(this)
}

GraphQLServer.prototype.initialize = function(params) { 
  var app = params.app, server = params.server,   subsServer

  this.host = config.host_ip || "localhost"
  if(this.endpointURL == "") this.endpointURL = "graphql" + moment()
  if(this.endpointGraphiQlURL = "") this.endpointGraphiQlURL = "graphiql" + moment()
  if(! this.port)  this.port = config.graphql.wssPort
  ApolloServer.applyMiddleware({ app })
  ApolloServer.installSubscriptionHandlers(server)
  
  //return new Promise((resolve, reject) => { 
    if(!ApolloServer || !server ) return ({ success: false, msg: 'Apollo Server or http(s) Server not specified', results: null }); 
    try { 
      ApolloServer.applyMiddleware({ app })
      ///GraphQL server - comment out apolloserver and uncomment below to enable graphql lib
      app.use('/graphql', graphqlExpress({ 
        schema: Schema,
        endpointURL: this.endpointURL,
        subscriptionsEndpoint: `wss://${this.host}:${this.port}/${this.endpointURL}`
      }));
        
      if(config.graphql.graphiql) { 
        app.use('/graphiql', graphiqlExpress({
          endpointURL: '/graphiql',
          subscriptionsEndpoint: `wss://${this.host}:${this.port}/graphiql`
        }));
        console.log(chalk.green("graphiql/graphiql server started successfully and listening at https://"+config.host_ip+":"  + config.port +"/graphiql"))
        var subsServer
          require('./subscription-server.js')(server, Schema, function(err, res) { 
            if(res.success) { 
                //console.log(res)
                subsServer = res
              } else { 
                console.log(chalk.red(res.msg))
                subsServer = null
              }
          })
          
          return({success: true, msg:"GraphQL intialization success!", results : subsServer})
      }
        
      }catch(e) { console.trace(e)
        return ({success: false, msg: e, results: null })
      }
  //})

}


//Testing
Object.defineProperty(GraphQLServer.prototype, "self", {
    get: function () {
        return this;
    },
    enumerable: false,
    configurable: true
});


module.exports = (params, cb) => { 
  var gqlServer = new GraphQLServer() 

  // Default options
  params = merge({
    integratedEngine: false
  }, params)

  cb(gqlServer.initialize(params))
  /*  .then((res) => (console.log(res)))
      .then((res) => {  console.log(res)
        if(res.success) {  
          cb(gqlServer.error, res.results)
        }
      }) */

  }