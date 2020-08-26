const _ = require('lodash')
const { RESTDataSource } = require('apollo-datasource-rest');
const { store } = require('../utils.js')

class AuthAPI extends RESTDataSource {
  
  constructor() {
    super();
    this.baseURL = 'https://165.22.35.93:3014/auth';
    _.bindAll(this)
  }

   
  async getTokenByEmail({ email, password }) {
    return await this.get('gettoken', { email: email, password: password });
  }

}

module.exports = AuthAPI