const { createStore } = require('./utils.js')
const pubsub = require('./pubsub')
const cwd = require('./connectors/cwd')
const store = createStore(); 
// Context passed to all resolvers (third argument)
// eslint-disable-next-line no-unused-vars
module.exports = ({ req } = {}) => {
  return {
    store,
    pubsub,
    cwd: cwd.get()
  }
}
