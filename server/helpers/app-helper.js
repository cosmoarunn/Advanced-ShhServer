/**
 *  
 *  Router Functions Helper
 * 
 *  
 *  Author: Arun Panneerselvam
 */
var path  = require('path')
var fs    = require('fs') 
var program = require('commander');


const App function() { 

}

  empty : (_obj) => { 
    if("undefined" === typeof _obj || _obj === "" || null === _obj)
      return true
    else 
      return false
  },

  promisify : (fn) => (...args) => new Promise((resolve, reject) => {
    fn(...args, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    });
  }),
  
  getVersion: function() {
    return util.getPackage().version;
  },

  getPackage: function() {
    if(_package)
      return _package;

    _package = JSON.parse( fs.readFileSync(__dirname + '/../package.json', 'utf8') );
    return _package;
  },
  getRequiredNodeVersion: function() {
    return util.getPackage().engines.node;
  },
  recentNode: function() {
    var required = util.getRequiredNodeVersion();
    return semver.satisfies(process.version, required);
  },

}




  defer: function(fn) {
    return function(args) {
      var args = _.toArray(arguments);
      return _.defer(function() { fn.apply(this, args) });
    }
  },