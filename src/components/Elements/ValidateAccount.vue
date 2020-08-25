<template>
<b-overlay :show="showProcessing" rounded="sm" @shown="onShown" @hidden="onHidden">
    <div class="text-left" >
      <b-card title="Account Public key (OpenSSL)" header-tag="header" footer-tag="footer">  
        <b-card-header >
            <b-container>
                <b-row> 
                <b-col cols="8" class="text-left"> 
                    <b-button-group>
                        <b-button variant="success" @click="getAccPubKey">Generate Key</b-button>
                        <b-button variant="primary" @click="copyKey" :disabled="pubKey==''">Copy Key <b-icon icon="clipboard-plus" animation="cylon"></b-icon></b-button>
                        <b-button variant="danger" @click="pubKey=''">Clear</b-button>
                    </b-button-group>
                </b-col>
                 <b-col cols="4" class="text-right"> <b-button href="#" @click="validatePubKey" :disabled="validateKey || pubKey==''" variant="primary">Validate PubKey</b-button>  </b-col>
                </b-row>
            </b-container>
        </b-card-header>

        <b-card-text>
          <b-form-textarea ref="pkeyText"  id="textarea" v-model="pubKey" placeholder="Your public key here.." rows="8" max-rows="8"></b-form-textarea>
        </b-card-text>
        
        
        <template v-slot:footer>
          <b-container>
            <b-row>  
              <div class="mt-2 help-content">
                HTTPSGen server generates public key automatically for you. If the secure HTTPSGen server is running, validate the generated public key and proceed to next step. Otherwise, generate a new account keypair using openssl and pubout to print your public key!<br>
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
            </b-row>
          </b-container>
          
        </template>
      </b-card>
    </div>
    <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label"><span>{{message}}</span></p>
        <b-button
          ref="cancel"
          variant="outline-danger"
          size="sm"
          aria-describedby="cancel-label"
          @click="showProcessing=false"
        >
          Cancel
        </b-button>
      </div>
    </template>  
  </b-overlay>
</template>

<script>

export default { 
  props: { 
    accName: String,
    email: String,
    loc: String,
    show: Boolean,
    disabled: Boolean,
  },
  data() { 
    return { 
      statusTxt: '',
      pubKey: '',
      validateKey:false,
      showProcessing: this.show,
      message: '',
    }
  },
  watch: {  
    email: { 
      immediate: true,
      handler() {  this.getAccPubKey()  }
    },
    
  },
  methods: { 
    updateAndMergeAccount: function(acc) {
        this.$store.commit('updateAndMergeAccount', acc)
        //this.$store.commit('updateProceed',true)
        //this.$store.commit('updateTabIndex', this.tabIndex++)
    }, 
    updatePubKey: function (pubkey) { 
        //var unarmor = /-----BEGIN PUBLIC KEY-----\n([A-Za-z0-9+/=\s]+)-----END PUBLIC KEY-----\n/;
        this.$store.commit('updatePubKey', pubkey) //unarmor.exec(pubkey)[1])
    },

    getAccPubKey: function() { 
      if("" == this.$store.state.AccName || "undefined" === this.$store.state.AccName || "" == this.$store.state.Email || "undefined" === this.$store.state.Email) return;
        this.message = "Generating new public and private key pairs..", this.showProcessing = true
        this.validateKey = false
        fetch('https://165.22.35.93:3030/letsencrypt/getkey', { 
          method: 'post',
          body: JSON.stringify({
                loc : this.loc + this.$store.state.AccName + '/',
                acc : this.$store.state.AccName,  
            }) 
        }).then((res) => (res.json()))
            .then((res) => { 
              this.$emit('key_generated', res.success)
              if(res.success) { 
                this.pubKey = res.msg
                this.updatePubKey(res.msg)
                this.showProcessing = false
              }
            })
      },
      validatePubKey: function() { 
        this.message = "Validating Public Key might take a while. Please sit tight.."; this.showProcessing = true
        fetch('https://165.22.35.93:3030/letsencrypt/validatePubKey', { 
          method: 'post',
          body: JSON.stringify({
                pubkey : this.$store.state.PubKey,
                email :  this.email,
            }) 
        }).then((res) => (res.json()))
            .then((res) => { 
                var success = res.result.success
                if(success) { console.log(res)
                    this.validateKey = success; this.message = "Public key validation success"
                    this.$emit('key_validated', success)
                    this.updateAndMergeAccount(res.account) ; this.message = "Processing public key and generating JWK Headers.."
                    this.processPublicKeyAndGenerateJwkHeaders(res.rsaME)
                    this.showAlert((success)?'success':'danger', res.result.msg)
                } else 
                    this.makeSimpleToast(success?'success':'danger',  res.result.msg, 'b-toaster-top-center')
                this.showProcessing = false
            })
      },
      showAlert: function(variant, msg) { 
           this.$store.commit('updateAlertShow', true)
           this.$store.commit('updateAlertClass', variant)
           this.$store.commit('updateAlert',msg)
      },
      makeSimpleToast: function(variant = null, content, toaster) { 
        this.$bvToast.toast(content, {  title: ` ${variant || 'default'}`,  variant: variant,  toaster: toaster,  solid: true }) 
      },
      onShown: function() { this.$refs.cancel.focus() },
      onHidden: function() { this.$refs.pkeyText.$el.focus()  },
      
      //Validate pubkey crypto
      jwkHeaderGenerate: function(rsaME) { 
        // generate the jwk header and bytes
        console.log(rsaME)
        var jwk = {
            "e": this.b64(new Uint8Array(rsaME.exponent)),
            "kty": "RSA",
            "n": this.b64(new Uint8Array(rsaME.modulus)),
        }
        var jwk_json = JSON.stringify(jwk);
        var jwk_bytes = [];
        for(var i = 0; i < jwk_json.length; i++){
            jwk_bytes.push(jwk_json.charCodeAt(i));
        }
        return {_jwk : jwk, jwk: jwk_json, bytes: jwk_bytes }
      },
      //Public key thumbprint - for verification only
      generateThumbprint: function(bytes) { 
        var DIGEST = window.crypto ? (window.crypto.subtle ? window.crypto.subtle.digest : undefined) : undefined;
        var digest_error = DIGEST ? false : true;
        if(digest_error) return false;
        
        var hash = window.crypto.subtle.digest({name: "SHA-256"}, bytes);
        return new Promise((resolve, reject) => {
          this.sha256(hash, function(hash, err) { 
            if(err) 
              reject(err)
            else
              resolve(hash)
          })
        })
      },

      sha256: function(hash, callback) { 
        // standard promise-based
        hash.then(function(result){ 
            callback(new Uint8Array(result), undefined);
        })
        .catch(function(error){
            callback(undefined, error);
        });
      },
      // url-safe base64 encoding
      b64: function(bytes){
          var str64 = typeof(bytes) === "string" ? window.btoa(bytes) : window.btoa(String.fromCharCode.apply(null, bytes));
          return str64.replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
      }, 
      //JWK Header generation
      processPublicKeyAndGenerateJwkHeaders: function(rsaME) { 
        var jwkH = this.jwkHeaderGenerate(rsaME)
        
        var account = this.$store.state.Account
        
        account['jwkH'] = jwkH
        this.generateThumbprint(new Uint8Array(jwkH.bytes))
          .then((res) => (res))
            .then((res) => { 
              account['generatedHash'] =  this.generatedHash = this.b64(res)
              //account['registration_payload_b64'] = this.b64(account.registration_payload_json)
              this.updateAndMergeAccount(account)
            })
      },
      
      copyKey:function(el) { 
        this.copyToclip(el)
        //this.$refs.pkeyText.$el.focus()
      }

  },


  mounted() { 
      this.$refs.pkeyText.$el.focus()
  }  
}
</script>