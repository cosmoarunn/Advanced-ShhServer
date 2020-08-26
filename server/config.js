/**
 * 
 *  
 * 
 * 
 *  Server Configuration file
 *  Author : Arun Panneerselvam
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { networkInterfaces } = require('os');



const nets = networkInterfaces();
const interfaces = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!interfaces[name]) {
                interfaces[name] = [];
            }

            interfaces[name].push(net.address);
        }
    }
}
//console.log(interfaces)
module.exports =  { 
        
  host: "0.0.0.0",
  host_ip: interfaces.eth0[0] || interfaces.en0[1] || '0.0.0.0',
  host_local: interfaces.eth0[1] || interfaces.en0[1] || '0.0.0.0',
  port: 3014,
  allowedOrigins : ['https://165.22.35.93:7070', 'ovpnman.arunpanneerselvam.com','https://httpsgen.arunpanneerselvam.com/', 'https://165.22.35.93:4040','https://arunpanneerselvam.com', 'https://gsunitedtechnologies.com'],
  superSecret:  '8m9u4L4VeiWkPLXEoWAbvwzb-nyw6eA2Nz1gUgNR45ytAcc1PHzFLomeYhFc6whQ4ieWpHAwF1WeZgFCqp316o8W00054587Q1m=',
  auth_duration : 30000, 
  //socket: 'https://' + getHost() + ':3030',
  secure: true,
  socketEnabled: true,
  corsEnabled: true,
  sslEnabled: true,
  sslOptions: { 
      key :  fs.readFileSync(path.resolve('./ssh/key.pem')),
      cert:  fs.readFileSync(path.resolve('./ssh/server.crt')) 
  },
  graphql: { 
    start: true,
    graphiql: true,
    //Graphql sub
    subsPath:  'graphql',
    wssPort: 3014,
  },
} 





