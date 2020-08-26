/**
 *  
 * 
 * 
 *  Router Functions Helper
 * 
 */
var path  = require('path')
var fs    = require('fs') 

module.exports = { 
  empty : function(_obj) { 
    if("undefined" === typeof _obj || _obj === "" || null === _obj)
      return true
    else 
      return false
  },

  //get IP of the request
  getIP: function(req) { 
     return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress        
  },

  //Read express web request
  parseRequest: function(req, callback) { 
    var body = {}, bodyStr = '', err;
    try { 
        req.on("data",function(chunk){
            bodyStr += chunk.toString('utf8')
        })
        req.on("end",function(){ console.log(bodyStr)
          try { 
            body = JSON.parse(bodyStr)
            callback( true, body)
          }catch(e) { 
            console.log(e)
          } 
          callback(false, bodyStr)  
            
        })
    } catch(err) { console.log(err)
        callback(err, false)
    }
  },

  getServerPrivateKey: function(path){ 
    return new Promise((resolve, reject) => { 
      if (fs.existsSync(path)) 
        try{ 
          resolve(fs.readFileSync(path, {encoding:enc, flag:'r'}))
        }catch(e) { 
          reject(e)
        }
      
    })
  }


}