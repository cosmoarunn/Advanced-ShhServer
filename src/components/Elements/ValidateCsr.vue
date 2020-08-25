<template>
  <b-overlay :show="showProcessing" rounded="sm" @shown="onShown" @hidden="onHidden">
  <div class="text-left" >
    <b-card title="Certificate Signing Request (CSR)" header-tag="header" footer-tag="footer">    
      <b-input-group>
          <template v-slot:prepend>
              <b-input-group-text class="pr-0" style="border-right: none; background-color:#fff!important;color:#58da86!important">Secure | https://</b-input-group-text>
          </template>
          <b-form-input class="pl-1" v-model="domain" ref="txtDmn" type="text" :state="dmnState" @keyup.enter="getCsr" @blur="dmnState=true" placeholder="yourDomain.tld"   size="md" style="border-left:none; background-color:#fff!important;color:#58da86!important"></b-form-input>
          
          <template v-slot:append>
              <b-dropdown text="Recent" variant="outline-info">
              <b-dropdown-item>-None-</b-dropdown-item> 
              </b-dropdown>
              <b-button href="#"  @click="getCsr" variant="success" :disabled="csrValidated"  size="md">Generate CSR</b-button>
          </template>
      </b-input-group>
      
      <div>
        <b-alert v-if="dmnState" show variant="success">
            <h4 class="alert-heading">Well done!</h4>
            <p>
                A Certificate Signing Request (CSR) has been successfully generated for your domain <code>{{domain}}</code>. 
                If you have pasted your CSR, then you must validate before sending the request to LetsEncrypt!
                
            </p>
            <hr>
            <p class="mb-0">
                Remember to read and accept LetsEncrypt&apos;s <a href="#">Terms Of Service</a>. 
            </p>
        </b-alert>
      </div>
      <b-card-header >
        <b-container>
          <b-row> 
            <b-col cols="8" class="text-left"> 
              <b-button-group >
                <b-button @click="getCsr" variant="success">Generate CSR</b-button>
                <b-button @click="copyCsr" variant="primary">Copy</b-button>
                <b-button @click="csr=''" variant="warning">Clear</b-button>
              </b-button-group>
            </b-col>
            <b-col cols="4" class="text-right"> 
            <b-button @click="validatecsr" :disabled="csrValidated" variant="outline-success">Validate CSR</b-button>
            </b-col>
          </b-row>
        </b-container>  
      </b-card-header>

      <b-card-text>
        <b-form-textarea ref="csr" id="pub-key" v-model="csr" placeholder="" rows="8" max-rows="8" ></b-form-textarea>
        <div class="mt-2 help-content">
            How to generate a new Certificate Signing Request (CSR):<br>
            <ol>
                <li>
                    Generate a TLS private key if you don't have one:<br>
                    (KEEP DOMAIN.KEY SAFE!)<br>
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
            <b-col sm="8"> 
              </b-col>
            <b-col sm="4"> <b-button href="#" @click="validatecsr" :disabled="csrValidated" variant="outline-success">Validate CSR</b-button></b-col>
          </b-row>
        </b-container>
      </template>
    </b-card>
  </div>

    <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label"><span >{{message}}</span></p>
        <b-button ref="cancel" variant="outline-danger" size="sm" aria-describedby="cancel-label"  @click="showProcessing=false">
          Cancel
        </b-button>
      </div>
    </template>  
  </b-overlay>
</template>

<script>

export default { 
  props: { 
    show: { type: Boolean, default: false },
    //domain: String,
    loc: String,
  },
  data() { 
    return {
      //domain: 'stocksonfire.co.uk',
      dmnState: false,
      csr: '',
      csrValidated:false,
      //validateCsr: false,
      showProcessing: this.show,
      message: '',
    }
  },
  computed: { 
      domain: {  get () {  return this.$store.state.Domain }, set (val) {  this.$store.commit('updateDomain', val) } },
      
  },
  watch: {  },
  methods: { 
    
    updateDomain:function (e) {
        this.$store.commit('updateDomain', e.target.value)
    },
    updateAndMergeAccount:function (acc) { 
        this.$store.commit('updateAndMergeAccount', acc)
    },
    updateAndMergeOrder:function (ord) { 
        this.$store.commit('updateAndMergeOrder', ord)
       
    },
    updateAndMergeCommand:function (command) { 
        this.$store.commit('updateCommands', command)
    },
    updateCsr:function (csr) {
        this.$store.commit('updateCsr', csr)
    },
    validatecsr: function() {  
      this.message = "Validating CSR.." ; this.showProcessing = true
      if(this.domain === "") return
        fetch('https://165.22.35.93:3030/letsencrypt/validateCsr', { 
        method: 'post',
        body: JSON.stringify({
          loc: this.loc + this.$store.state.AccName + '/',  
          csr: this.csr,
          domain : this.$store.state.Domain,
          newNonceDir: this.$store.state.Directories.newNonce,
          accDir: this.$store.state.Directories.newAccount,
          alg: this.$store.state.Account.alg,  
          jwk: this.$store.state.Account.jwkH._jwk,  
          accName: this.$store.state.AccName  
        }) 
      }).then((res) => (res.json()))
          .then((res) => { 
            if(!res.success) { 
              this.message = "CSR Validation failed, refresh the page and try again!"
            } else { 
              this.makeSimpleToast('success',  'CSR verification success!', 'b-toaster-top-center')
              this.csrValidated = res.success
              this.$emit('csr_validated', res.success)
              this.message = "CSR validation success! Writing registration information."
              res.account.registration_protected_b64 = this.b64(JSON.stringify(res.account.registration_protected_json))
              //res.account.registration_payload_b64 = this.b64(JSON.stringify(res.account.registration_payload_json)) 
              res.account.registration_sig_hex = this.hex2b64(res.account.registration_sig)
              this.message = "Updating current state"; console.log(res.account)
              this.updateAndMergeAccount(res.account)
              this.updateAndMergeOrder(res.order)
              this.updateAndMergeCommand(res.command)
            }
              this.showProcessing = false
          })
    },
    getCsr:function() {  
      if("" == this.domain || "undefined" === typeof this.domain) { 
        this.makeSimpleToast('danger',  'Invalid domain name.', 'b-toaster-top-center')
        this.$refs.txtDmn.$el.focus()
        return false;
      } else { 
        this.message = "Generating Domain Private key and CSR.."; this.showProcessing = true
        fetch('https://165.22.35.93:3030/letsencrypt/getCsr', { 
          method: 'post',
          body: JSON.stringify({
            loc: this.loc + this.$store.state.AccName + '/',  
            domain : this.domain,  
          }) 
        }).then((res) => (res.json())) 
            .then((res) => { console.log(res)
                this.csr = res.msg
                this.updateCsr(res.msg)
                this.dmnState = res.success?true:false                
                this.showProcessing = false 
            })
      }
      
    },
    copyCsr: function() {
      return false
    },
    makeSimpleToast:function(variant, content, toaster) { 
        this.$bvToast.toast(content, {  title: ` ${variant || 'default'}`,  variant: variant,  toaster: toaster,  solid: true }) 
      },
    onShown:function() { this.$refs.cancel.focus()},
    onHidden:function() { this.$refs.csr.$el.focus() },
     
    // url-safe base64 encoding
    b64:function(bytes){
        var str64 = typeof(bytes) === "string" ? window.btoa(bytes) : window.btoa(String.fromCharCode.apply(null, bytes));
        return str64.replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
    },
      
    hex2b64:function(hex) { 
        // parse openssl hex output
      var OPENSSL_HEX = /(?:\(stdin\)= |)([a-f0-9]{512,1024})/
      if(!OPENSSL_HEX.test(hex)){
            return null;
        }
        hex = OPENSSL_HEX.exec(hex)[1]; 
        var bytes = [];
        while(hex.length >= 2){
            bytes.push(parseInt(hex.substring(0, 2), 16));
            hex = hex.substring(2, hex.length);
        }
        return this.b64(new Uint8Array(bytes));
    },
    // url-safe base64 encoding
    cachebuster: function(){
        return "cachebuster=" + this.b64(window.crypto.getRandomValues(new Uint8Array(8)));
    },
  },

  mounted: function() { 
    this.csr = this.$store.state.CSR
    //if("" == this.csr || "undefined" === typeof this.csr) 
      //this.getCsr()
    
    this.$refs.csr.$el.focus()
    
  }
}
</script>