const path        = require('path');
const express     = require('express');
const fs          = require('fs');

const Promise     = require('promise');
const request     = require('request');
const cors        = require('cors');
const config      = require('../config')
const jwt         = require('jsonwebtoken');

const rHelper     = require('../helpers/router-helper')

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } =  require('subscriptions-transport-ws')
const Schema = require('./graphql/schema.js')

//Route
const GraphqlRouter   = express.Router();

//A Simple get to auth
GraphqlRouter.get('/', cors(),function(req, res) { 
  var ip = rHelper.getIP(req)
  res.json({success: true, msg: "auth router received your request and responds hello!", data: {} })
})