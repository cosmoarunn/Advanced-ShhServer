/**
 *  Advanced SHH Server
 * 
 * 
 *  File Functions Helper
 *  Author: Arun Panneerselvam
 */
var path  = require('path')
var fs    = require('fs') 

module.exports = { 
  //Read file contents from path
  readFileContents: function(path){ 
    return new Promise((resolve, reject) => { 
      if (fs.existsSync(path)) 
        try{ 
          resolve(fs.readFileSync(path, {encoding:enc, flag:'r'}))
        }catch(e) { 
          reject(e)
        }
      
    })
  },
  //Write file contents to path
  writeFileContents: function(path) { 
    return new Promise((resolve, reject) => { 
      if (fs.existsSync(path)) 
        try{ 
          resolve(fs.writeFileSync(path, {encoding:enc, flag:'w'}))
        }catch(e) { 
          reject(e)
        }
      
    })
  },
   


}