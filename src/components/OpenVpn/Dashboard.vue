<template>
  <div >
  <b-alert :show="this.alertShow" dismissible :variant="this.alertClass"><a href="#" class="alert-link" ></a>{{ this.alert }}</b-alert>
  <b-container fluid class="p-5">
   <template>
      <div class="text-right m-4">
        <b-button-group>
        <b-button  variant="outline-info">
            <b-icon icon="tools"></b-icon> Add Server
          </b-button>
          <b-button  variant="outline-info">
            <b-icon icon="tools"></b-icon> Settings
          </b-button>
          <b-button variant="outline-info">
            <b-icon icon="person-fill"></b-icon> Account
          </b-button>
          <b-button variant="outline-info">
            <b-icon icon="inbox-fill"></b-icon> Messages
          </b-button>
        </b-button-group>
      </div>
    </template>
    <div>
      <b-card no-body >
        <b-tabs v-model="tabIndex" pills  card  lazy> 
        <b-tab title="Servers" active>
        <b-card-text>
          <b-row class="">
            
            <b-col cols="12">
              <div>
              <b-alert v-if="authorized" show="" variant="warning">
                <h4 class="alert-heading">Validate Server Access</h4>
                <p>To manage AdmiralVPN Servers, you need to validate with your email and account secret. If you don&apos;t have an account secret, contact system administrator!</p>
                <hr> 
                <p class="mb-0">
                  Or, you may request an account secret to be issued. 
                  <b-button href="#"  @click="$bvModal.show('bv-modal-request-secret')" :disabled="emValidated" variant="outline-success" size="sm">Request Secret</b-button>
                </p>
                <b-form-checkbox v-model="checked" name="check-button" switch>
                    Remember me for 30 days <i v-b-popover.hover.top="'If check this on, you may not need to provide security code every time you access the dashboard for the next 30 days.'" title="Remember Me">What&apos;s this?</i>
                  </b-form-checkbox>
              </b-alert>
              
              <b-modal id="bv-modal-request-secret" @show="resetModal"  @hidden="resetModal"  @ok="handleOk">
                <template v-slot:modal-title>Request Account Secret</template>
                <div class="d-block text-center">
                    <form ref="form" @submit.stop.prevent="handleSubmit">
                      <b-form-group
                        :state="Email"
                        label="Email"
                        label-for="email-input"
                        invalid-feedback="Name is required"
                      >
                        <b-form-input
                          id="email-input"
                          v-model="email"
                          :state="Email"
                          required
                        ></b-form-input>
                      </b-form-group>
                    </form>
                </div>
              </b-modal>
              </div>
              <div v-if="authorized">
               
              <ApolloQuery
                :query="require('../../graphql/Servers.gql')"
                :variables="{ }"
              >
              <template slot-scope="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occured</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                <b-card-group deck> 
                  <div v-for="(srv, index) in data.servers" v-bind:key="index">
                    <ServerCard  :server="srv" /> 
                  </div>
                </b-card-group>
                </div>
                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
               
              <div>
               <ValidateEmail v-if="!authorized"  @email_validated="onEmailValidate"  />
                  
                </div>
              </div>
              <div>
                <ValidateAccount v-if="emState" :disabled="!emState" :accName="accName"  @key_generated="onKeyGenerate" @key_validated="onKeyValidate"  :email="email" :loc="loc" /> 
              </div>            
            </b-col>
          </b-row>
        </b-card-text>
            </b-tab>
            <b-tab :disabled="!authorized"  title="Connections"> 
              <b-card-text>
                <Connections 
                     />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!validateKey" :show="validateKey" title="Clients"> 
              <b-card-text>
                <ValidateCsr 
                    @csr_generated="onCsrGenerate" @csr_validated="onCsrValidate" 
                :loc="loc" />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!authorized" :show="validateCsr" title="Payments">
              <b-card-text>
                <Ownership  :termsUrl="terms_url"  :show="false"  />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!authorized"  title="Server Logs">
              <b-card-text>
                <ServerLog   />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!authorized" :show="validateOwner" title="Settings">
              <b-card-text>
                <Process  :termsUrl="terms_url"  />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!finalize" :show="finalizeOrder" title="Help">
              <b-card-text>
                <Process  :termsUrl="terms_url"  />
              </b-card-text>
            </b-tab>
            </b-tabs>
        
        </b-card>
        <b-container class="mt-5 text-right" align-v="end">
            <b-row class="p5">  
                <b-col sm="4">   </b-col>
                <b-col sm="4">   User: {{ me?me.email:'unknown' }} </b-col>
                
            </b-row>  
        </b-container>
    </div>           
 <!-- 
    <div> 
        <b-button @click="showModal" ref="btnShow">Yes, I agree</b-button>
       
        <b-modal id="modal-1">
            <div class="d-block">Our Cookie Policy : This website uses essential cookies in order for you to have better experience. The program flow is designed using cookies and session variables. By continuing to this site, we assume you agree to this policy.</div>
            <b-button @click="hideModal">Close</b-button>
        </b-modal>
      </div> -->
      
    </b-container>
  
  </div>
</template>

<script>
//import gql from 'graphql-tag'
import ValidateEmail from '../Elements/ValidateEmail.vue'
//import ValidateAccount from './Elements/ValidateAccount.vue'
//import ValidateCsr from './Elements/ValidateCsr.vue'
//import Ownership from './Elements/Ownership.vue'
//import Process from './Elements/Process.vue'

import ServerCard from '../Elements/Server.vue'
import Connections from '../Elements/Connections.vue'
import ServerLog from '../Elements/Events.vue'

export default {
  name: 'Events',
  components: { 
    ServerCard,
    Connections,
    ServerLog, 

    ValidateEmail,
    //ValidateAccount,
    //ValidateCsr,
    //Ownership,
    //Process,
  },
  data() { 
    return {
      me: null,
      accName: '',
      email: '',//'arun@fgmonuments.uk',
      domain: '',
      account: {},
      order: {},
      authorizations: {},
      directories: {},
      emState: false,
      validateKey: false,
      validateCsr: false,
      validateOwner: false,
      finalizeOrder: false,
      loc: '/opt/',
      showProcessing: false,
      terms_accpeted: false,
      terms_url: '',
      //tabIndex: 0,
      ownership: false,
      finalize: false,
    }  
  },
  apollo: { 

  },
  computed: { 
      authorized: { get() { return this.$store.state.authorized }},
      alert: {   get() { return this.$store.state.alert  }, set(val) { this.$store.commit('updateAlert', val) } },
      alertClass: {   get() { return this.$store.state.alertClass  }, set(val) { this.$store.commit('updateAlertClass', val) } },
      alertShow: {   get() { return this.$store.state.alertShow  }, set(val) { this.$store.commit('updateAlertShow', val) } },
      tabIndex: { get() { return this.$store.state.tabIndex  }, set(val) { this.$store.commit('updateTabIndex', val) } },
  },
  watch: { 
    //watch token expiration and signout
    //emState: { immediate: true, handler() {  this.tabIndex++; this.$store.commit('updateTabIndex', this.tabIndex);   } },
  },
  methods: { 
    //updateDirectories(dirs) {  this.$store.commit('updateDirectories', dirs)  },
    emailValidated() {  this.emState = true },
    updateAccName(val) { 
      this.accName = (val)?val:'unknown';
      this.loc += val + "/"; 
    },
    onEmailValidate: function() {  
      this.emState = true
      this.$store.commit('updateAlertShow', false)  
    }, 
    onKeyGenerate:function(val) { console.log(val) },
    onKeyValidate:function(val) {  console.log(val)
      if(val) { 
        this.validateKey = true
        
        this.$store.commit('updateAlertShow', false)
      } else {  this.validateKey = false  }
      
    },
    onCsrGenerate:function(val) {   console.log(val) },
    onCsrValidate:function(val) { 
      if(val) { 
        this.validateCsr = true 
        
        this.$store.commit('updateAlertShow', false)
      } else { this.validateCsr = false }
    },
    
    //prevTab() { if(this.tabIndex > 0) this.tabIndex--; this.$store.commit('updateTabIndex', this.tabIndex) },
    nextTab() { console.log('next tab..'); if(this.tabIndex <= 4) this.tabIndex++; this.$store.commit('updateTabIndex', this.tabIndex) },

    
    makeSimpleToast:function(variant = null, content, toaster) {
      this.$bvToast.toast(content, {
        title: `Variant ${variant || 'default'}`,
        variant: variant,
        toaster: toaster,
        solid: true
      })
    },
    onShown:function() { this.$refs.cancel.focus() },
    onHidden:function() { this.$refs.showProcessing.focus() },
  
    //Modal Methods
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      return valid
    },
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    }


  },
  mounted: function() { 
    if(! this.authorized) 
      this.$router.push('/signin')
  }


}

</script>


<style>
  .console > div { 
    background: #000000;
    color: #fff;
    fon-family: 'Lucida Console', 'Sans Seriff';
    font-size:0.8em;
  }
</style>