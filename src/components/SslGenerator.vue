<template>
  <div >
    <ValidateAccount v-if="emState" :email="email" :loc="loc" /> 
    <b-overlay :show="showProcessing" rounded="sm" @shown="onShown" @hidden="onHidden">
      <div>
        <b-alert show :variant="msgClass"><a href="#" class="alert-link">{{ message }}</a></b-alert>

        <h6>Account Email: </h6>
        <b-form-input v-model="email" type="email" :state="emState"  placeholder="you@yourdomain.tld"  @blur="validateEmail" size="lg"></b-form-input>
        
      </div>
         
      <div class="text-left" >
        <b-card-group deck>
          <b-card title="Account Public key (OpenSSL)" header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <b-form-input v-model="pkFname" type="text" :state="pkFnameState"  placeholder="/opt/account.key"  @blur="validateEmail" size="lg"></b-form-input>
            </template>
            <b-card-text>
              <b-button-group size="sm">
                  <b-button variant="primary">Auto Generate</b-button>
                  <b-button variant="success">HTTPSGen Server</b-button>
                  <b-button variant="warning">Clear</b-button>
                </b-button-group>
              <b-form-textarea
                  id="textarea"
                  v-model="pubKey"
                  placeholder="Your public key here.."
                  rows="8"
                  max-rows="8" :disabled="active == 0"
                ></b-form-textarea>
              
                <div class="mt-2 help-content">
                    HTTPSGen server generates public key automatically for you. If the secure HTTPSGen server is running on the backend you may go to next step. Otherwise, generate a new account keypair using openssl and pubout to print your public key!<br>
                    <ol>
                        <li>
                            Generate an account private key if you don't have one:<br>
                            (KEEP ACCOUNT.KEY SECRET!)<br>
                            <code>openssl genrsa 4096 &gt; account.key</code>
                        </li>
                        <li>
                            Print your public key:<br>
                            <code>openssl rsa -in account.key -pubout</code>
                        </li>
                        <li>
                            Copy and paste the public key into the box below.<br>
                        </li>
                    </ol>
                </div>
            </b-card-text>
            
            
            <template v-slot:footer>
              <b-container>
                <b-row>
                  <b-col sm="8"> Validate public key here  </b-col>
                  <b-col sm="4"> <b-button href="#" @click="validatePubKey" :disabled="validateKey" variant="primary">Validate PubKey</b-button></b-col>
                </b-row>
              </b-container>
              
            </template>
          </b-card>
          
          <b-card title="Certificate Signing Request" header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <b-form-input v-model="domain" type="text" :state="dmnState"  placeholder="yourDomain.tld"  @blur="getCsr" size="lg"></b-form-input>
            </template>
            <b-card-text> 
              <b-button-group size="sm">
                  <b-button variant="primary">Auto Generate</b-button>
                  <b-button variant="success">HTTPSGen Server</b-button>
                  <b-button variant="warning">Clear</b-button>
              </b-button-group>
              <b-form-textarea
                id="pub-key"
                v-model="csr"
                placeholder=""
                rows="8"
                max-rows="8" 
                :@blur="validatecsr(csr)"
              ></b-form-textarea>
            

              <div class="mt-2 help-content">
                How to generate a new Certificate Signing Request (CSR):<br>
                <ol>
                    <li>
                        Generate a TLS private key if you don't have one:<br>
                        (KEEP DOMAIN.KEY SECRET!)<br>
                        <code>openssl genrsa 4096 &gt; domain.key</code>
                    </li>
                    <li>
                        Generate a CSR for your the domains you want certs for:<br>
                        (replace "foo.com" with your domain)<br>
                        Linux:
            <code>    <pre>
            #change "/etc/ssl/openssl.cnf" as needed:
            #  Debian: /etc/ssl/openssl.cnf
            #  RHEL and CentOS: /etc/pki/tls/openssl.cnf
            #  Mac OSX: /System/Library/OpenSSL/openssl.cnf
            </pre>
            openssl req -new -sha256 -key domain.key -subj "/"  -reqexts SAN -config &lt;(cat /etc/ssl/openssl.cnf   &lt;(printf "\n[SAN]\nsubjectAltName=DNS:foo.com,DNS:www.foo.com"))
            </code>
                    </li>
                    <li>
                        Copy and paste the CSR into the box above.<br>
                    </li>
                </ol>
            </div>
            </b-card-text>
            
            
            <template v-slot:footer>
              <b-container>
                <b-row>
                  <b-col sm="8"> Validate CSR  here  </b-col>
                  <b-col sm="4"> <b-button href="#" @click="validatecsr" :disabled="validated" variant="primary">Validate CSR</b-button></b-col>
                </b-row>
              </b-container>
            </template>
          </b-card>
          
        </b-card-group>
        
      </div>
      
      
        
      <div class="text-center">
        <b-button-toolbar class="ml-5 mb-4 mt-4" key-nav aria-label="Toolbar with button groups">
         
          <b-button-group class="mx-1 ">
            <b-button variant="primary" href="#" :disabled="!hasPrevious">&laquo; Back</b-button>
            <b-button variant="success" href="#" :disabled="!completed" >Next &raquo;</b-button>
          </b-button-group>
         
        </b-button-toolbar>
      </div>
      <template v-slot:overlay>
          <div class="text-center">
            <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
            <p id="cancel-label">Generating Public Key or CSR might take a while. Please sit tight...</p>
            <b-button
              ref="cancel"
              variant="outline-danger"
              size="sm"
              aria-describedby="cancel-label"
              @click="showProcessing = false"
            >
              Cancel
            </b-button>
          </div>
        </template>  
      </b-overlay>
    </div>
</template>

<script>
import ValidateAccount from './Elements/ValidateAccount.vue'

  export default {
  components: { 
    ValidateAccount,
  },
  data() {
    return {
      active: 1,
      email: '',
      domain: '',
      pubKey: 'Verify account email to generate a new pair of public & private keys. Also, You can paste your account public key directly here',
      certificate: '',
      step: 1,
      completed: false,
      hasPrevious: false,
      msgClass: 'info',
      message: 'Validate your account email to get started!',
      emState: false,
      dmnState: false,
      validated: false,
      validateKey: false,
      csr: 'Provide a domain name to generate CSR',
      loc: '/opt/',
      showProcessing: false,
    }
  },
  computed: { 
    nextStepState() {
      return (this.dmnState && this.emState && this.validateKey && this.validated && !this.showProcessing )? true : false
    }
  },
  methods: { 
    validateEmail: function() { 
      fetch('https://165.22.35.93:3030/letsencrypt/validateEmail', { 
        method: 'post',
        body: JSON.stringify({
              email: this.email,
          }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              this.emState = res.success?true:false
              if(res.success)
                this.getAccPubKey()
              this.msgClass = res.success?'success':'danger'             
              this.message = res.msg
              
          })
    },
    getAccPubKey: function() { 
      this.showProcessing = true
      fetch('https://165.22.35.93:3030/letsencrypt/getkey', { 
        method: 'post',
        body: JSON.stringify({
              loc : this.loc,  
          }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              this.pubKey = res.msg
              this.showProcessing = false
          })
    },
    validatecsr: function() {  
      if(this.domain === "") return
        fetch('https://165.22.35.93:3030/letsencrypt/validateCsr', { 
        method: 'post',
        body: JSON.stringify({
          loc: this.loc,  
          csr: this.csr,
          domain : this.domain,  
        }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              this.csr = res.msg
              this.validated = res.success
          })
        
    },
    getCsr:function() { 
      this.showProcessing = true
      fetch('https://165.22.35.93:3030/letsencrypt/getCsr', { 
        method: 'post',
        body: JSON.stringify({
          loc: this.loc,  
          domain : this.domain,  
        }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              this.csr = res.msg
              this.dmnState = res.success?true:false                
              this.showProcessing = false
          })
    },
    validatePubKey: function() { 
      fetch('https://165.22.35.93:3030/letsencrypt/validatePubKey', { 
        method: 'post',
        body: JSON.stringify({
              pubkey : this.pubKey,  
          }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              this.validateKey = !res.error
              var vrnt = res.error?'danger':'success';
              this.makeSimpleToast(vrnt, 'PubKey successfully verified' + res.msg, 'b-toaster-top-center')
          })
    },
    acceptLetsEncryptTerms: function() { 
      
    },
    makeSimpleToast(variant = null, content, toaster) {
      this.$bvToast.toast(content, {
        title: `Variant ${variant || 'default'}`,
        variant: variant,
        toaster: toaster,
        solid: true
      })
    },
    onShown() {
      // Focus the cancel button when the overlay is showing
      this.$refs.cancel.focus()
    },
    onHidden() {
      // Focus the show button when the overlay is removed
      this.$refs.showProcessing.focus()
    },
    
  },
  mounted: function() { 
    
  }
}

</script>