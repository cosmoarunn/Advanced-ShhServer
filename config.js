/**
 *  Server Configuration file
 *  Author : Arun Panneerselvam
 * 
 * 
 */

const path = require('path');
const fs = require('fs');

module.exports =  { 
  appName: 'Advanced SHH Server Demo',      
  host: getHost(),
  port: 7070,
  allowedOrigins : ['https://165.22.35.93:4040','https://arunpanneerselvam.com', 'https://gsunitedtechnologies.com'],
  superSecret:  '29mu2L4VeiWkPLXEoWAbvwzb-nyw6eA2NY1gUgNR3-Adqec1PHzFL1meYhFD6whq4ieWp83HA55F1WeZgFCqpd6o8W00054587Q1*==',
  auth_duration : 30000, 
  socket: 'https://' + getHost() + ':7070',
  https: true,
  corsEnabled: true,
  sslOptions: { 
      key :  fs.readFileSync(path.resolve('./ssh/key.pem')),
      cert:  fs.readFileSync(path.resolve('./ssh/server.crt')) 
  },
}

function getHost(name) {
  return process.env.CI === 'true' ? name : '127.0.0.1';
}

