import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: { 
    AccName: '',//'aeroarunn',
    Email: '',//'arun@stocksonfire.co.uk',
    authorized: false,
    recentEmails: [],
    Domain: '',//'stocksonfire.co.uk',
    PubKey: '',
    CSR: '',
    Loc: '/opt/',
    Account: {},
    Directories: {},
    Order:{},
    Authorizations: {},
    tabIndex: 0,
    //commands & conditions
    commands: [],
    conditions: [],
    //info
    alertClass: 'info',
    alert: '',
    alertShow: false,
    alertType: '',
    agreedCookie: false,
    newNonce: '',
    //steps
    proceed: false
  },
  mutations: { 
    
    updateAndMergeState(state,payload) { 
        _.merge(state, payload)
    },
    updateTab(state, payload) {
      state.tab = payload
    },
    updateAccName(state, payload) { 
      state.AccName = payload
    },
    updateEmail(state, payload) {
      state.Email = payload
    },
    updateAuthorized(state, payload) { 
      state.authorized = payload
    },
    updateRecentEmails(state, payload) { 
      _.union(state.recentEmails, [payload]) 
    },
    updateDomain(state, payload) {
      state.Domain = payload
    },
    updateDirectories(state, payload) {
      state.Directories = payload
    },
    updatePubKey(state, payload) {
      state.PubKey = payload
    },
    updateCsr(state, payload) {
      state.CSR = payload
    },
    updateAccount(state, payload) {
      state.Account = payload
    },
    updateAndMergeAccount(state, payload) { 
        _.merge(state.Account, payload)
    },
    updateCommands(state,payload) { 
        _.merge(state.commands, payload)
    },
    updateOrder(state, payload) {
      state.Order = payload
    },
    updateAndMergeOrder(state, payload) { 
        _.merge(state.Order, payload)
    },
    updateAuthorizations(state, payload) {
      state.Authorizations = payload
    },

    //Alerts
    updateAlertClass(state, payload) { 
        state.alertClass = payload
    },
    updateAlert(state, payload) { 
        state.alert = payload
    },
    updateAlertShow(state, payload) { 
        state.alertShow = payload
    },
    updateAlertType(state, payload) { 
        state.alertType = payload
    }, 
    updateTabIndex(state, payload) { 
        state.tabIndex = payload
    },
    updateProceed(state, payload) { 
        state.proceed = payload
    }, 
    updateAgreedCookie(state, payload) { 
        state.agreedCookie = payload
    },
    updateNewNonce(state,payload) { 
      state.newNonce = payload.headers['replay-nonce']
    },

  },

  actions: { 

    async getNonce({commit}, cachebuster) { 
      axios.get(this.state.Directories.newNonce + '?cachebuster='+cachebuster)
        .then(response => { console.log(response)
          commit({type: 'updateNewNonce', response  })
          
      })
    },
    async getDirectories({commit}) { 
      return new Promise((resolve, reject) => { 
        try { 
         axios.get("https://acme-staging-v02.api.letsencrypt.org/directory")
            .then((response) => { var dirs = response.data
              commit({type: 'updateDirectories', dirs  })
              resolve({ success: true, msg: dirs})
          })
        }catch(err) { 
          reject ({ success: false, msg: err})
        }
      })
      
    },


    

  },
  modules: {

  }
})
