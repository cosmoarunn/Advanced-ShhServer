<template>
  <div>
  <b-alert :show="this.alertShow" dismissible :variant="this.alertClass"><a href="#" class="alert-link" ></a>{{ this.alert }}</b-alert>
  <b-container class="p-5 bv-example-row">
    <div>
      <b-card no-body>
        <b-tabs v-model="tabIndex" pills  card vertical lazy> 
        <b-tab title="Servers" active><b-card-text>
        <b-row class="">
        <b-alert v-if="!emState" show variant="info">
          <h4 class="alert-heading">Let&apos;s get started!</h4>
          <p>
          Letsencrypt is a free SSL Certificates provider for your domains. An account will be created for your domain and an email is used for any communication.
          </p>
          <hr> 
          <p class="mb-0">
          Whenever you&apos;'re ready, provide an email to generate a Public Key!
          </p>
        </b-alert>
            <b-col cols="12">
              <div>
                <ValidateEmail  @email_validated="onEmailValidate"  v-if="!emState"  />
              </div>
              <div>
                <ValidateAccount v-if="emState" :disabled="!emState" :accName="accName"  @key_generated="onKeyGenerate" @key_validated="onKeyValidate"  :email="email" :loc="loc" /> 
              </div>            
            </b-col>
            </b-row>
                  </b-card-text>
            </b-tab>
            <b-tab :disabled="!validateKey" :show="validateKey" title="Clients"> 
              <b-card-text>
                <ValidateCsr 
                    @csr_generated="onCsrGenerate" @csr_validated="onCsrValidate" @terms_accpeted="acceptLetsEncryptTerms" 
                :loc="loc" />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!validateCsr" :show="validateCsr" title="Ownership">
              <b-card-text>
                <Ownership  :termsUrl="terms_url"  :show="false"  />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!ownership" :show="validateOwner" title="Cert Order">
              <b-card-text>
                <Process  :termsUrl="terms_url"  />
              </b-card-text>
            </b-tab>
            <b-tab :disabled="!finalize" :show="finalizeOrder" title="Finalize">
              <b-card-text>
                <Process  :termsUrl="terms_url"  />
              </b-card-text>
            </b-tab>
            </b-tabs>
        
        </b-card>
        <b-container class="mt-5 text-right" align-v="end">
            <b-row class="p5">  
                <b-col sm="4">   </b-col>
                <b-col sm="4">   Tab Index: {{tabIndex}} </b-col>
                
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
import gql from 'graphql-tag'

import ValidateEmail from './Elements/ValidateEmail.vue'
import ValidateAccount from './Elements/ValidateAccount.vue'
import ValidateCsr from './Elements/ValidateCsr.vue'
import Ownership from './Elements/Ownership.vue'
import Process from './Elements/Process.vue'

export default {
  name: 'HTTPSGen',
  components: { 
    ValidateEmail,
    ValidateAccount,
    ValidateCsr,
    Ownership,
    Process,
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
      me: gql`query { 
        me { 
          id
          name
          email
        }
      }`
  },
  computed: { 
      alert: {   get() { return this.$store.state.alert  }, set(val) { this.$store.commit('updateAlert', val) } },
      alertClass: {   get() { return this.$store.state.alertClass  }, set(val) { this.$store.commit('updateAlertClass', val) } },
      alertShow: {   get() { return this.$store.state.alertShow  }, set(val) { this.$store.commit('updateAlertShow', val) } },
      tabIndex: { get() { return this.$store.state.tabIndex  }, set(val) { this.$store.commit('updateTabIndex', val) } },
  },
  watch: { 
    
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
        this.getDirectories()
        this.$store.commit('updateAlertShow', false)
      } else {  this.validateKey = false  }
      
    },
    onCsrGenerate:function(val) {   console.log(val) },
    onCsrValidate:function(val) { 
      if(val) { 
        this.validateCsr = true 
        this.getTermsUrl() 
        this.$store.commit('updateAlertShow', false)
      } else { this.validateCsr = false }
    },
    
    //prevTab() { if(this.tabIndex > 0) this.tabIndex--; this.$store.commit('updateTabIndex', this.tabIndex) },
    nextTab() { console.log('next tab..'); if(this.tabIndex <= 4) this.tabIndex++; this.$store.commit('updateTabIndex', this.tabIndex) },

    getDirectories:function() { 
      this.message = "Public key validated successfully. Requesting Letsencrypt directories.."; this.showProcessing = true
      this.$store.dispatch('getDirectories')
        .then((res) => { 
          if(res.success) { 
              this.directories = res.msg
              this.terms_url = res.dirs.meta.termsOfService
              this.showProcessing = false
              this.nextTab()
          } else { 
            this.makeSimpleToast('danger',  res.msg, 'b-toaster-top-center')
          }
        })
      
      /*
      fetch('https://165.22.35.93:3030/letsencrypt/directories', { 
          method: 'post',
          body: JSON.stringify({
            email: this.email,  
            domain : this.domain,  
          }) 
        }).then((res) => (res.json()))
            .then((res) => { 
              this.directories = res.dirs
              this.updateDirectories(res.dirs)
              this.terms_url = res.dirs.meta.termsOfService
              this.showProcessing = false
              this.nextTab()
            })
      */
    }, 
    getTermsUrl:function() {
      this.message = "CSR validation success! Requesting Letsencrypt terms.."; this.showProcessing = true
      fetch('https://165.22.35.93:3030/letsencrypt/terms', { 
          method: 'post',
          body: JSON.stringify({
            email: this.email,  
            domain : this.domain,  
          })  
        }).then((res) => (res.json()))
            .then((res) => { 
                this.terms_url = res.url
                this.showProcessing = false
                this.nextTab() 
            })
    },
    acceptLetsEncryptTerms: function() { 
      
    }, 
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
    
  },
  mounted: function() { 
    //console.log('HTTPSGen mounted..')
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