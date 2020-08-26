<template>
  <b-overlay show="showProcessing" rounded="sm" @shown="onShown" @hidden="onHidden">
   <div>
        <b-alert show variant="info">
            <h4 class="alert-heading">Excellent!</h4>
            <p>
                That&apos;s it, We&apos;ve completed all necessary steps and ready to request LetsEncrypt.org to provide
                SSL (HTTPS) certificate for the domain. To proceed further you need to accept LetsEncrypt Terms , 
                <b-card title="Accept LetsEncrypt Terms" header-tag="header" footer-tag="footer">
                  <div>
                      <b-form-checkbox v-model="tos_accept" @click="acceptTerms"  name="check-button" switch>
                          I have read and accept <a @click="OpenInNewTab(termsUrl)" :href="termsUrl">  LetsEncrypt  Terms &amp; Conditions </a> and <a @click="OpenInNewTab(termsUrl)" :href="termsUrl"> Privacy Policy </a> of this website.
                      </b-form-checkbox>
                  </div>
                </b-card> 
            </p>
            <hr>
            <p class="mb-0">
                You need to verify your domain owenership by a few convenient methods. 
                <b-button pill href="#" @click="updateAccount" :disabled="!this.tos_accept" variant="outline-success" size="lg">Proceed &raquo;</b-button>
            </p>
        </b-alert>
    </div>
    <div>
    <b-tabs content-class="mt-3" justified lazy>
        <b-tab title="HTTP"><p>I'm the tab with the very, very long title</p></b-tab>
        <b-tab title="DNS Record" active><p>I'm the first tab</p></b-tab>
        <b-tab title="Python"><p>I'm the second tab</p></b-tab>
        <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
    </b-tabs>
    </div>
  <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label">Registering and creating account..</p>
        <b-button
          ref="cancel"
          variant="outline-danger"
          size="sm"
          aria-describedby="cancel-label"
          @click="show = false"
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
    show: { type: Boolean, default: true },

  },
  data() { 
    return {
      tos_accept: false, 
      showProcessing: this.show,
    }
  },
  computed: { 
    termsUrl: { 
          get() { 
            return (this.$store.state.Directories.meta)?this.$store.state.Directories.meta.termsOfService:''
          }
      }
  },
  methods: { 
    updateAccount:function() { 
      
      this.$store.dispatch('getNonce', this.cachebuster()).then((res) => {
          console.log(res)
      })


 
      this.showProcessing = true
      fetch('https://165.22.35.93:3030/letsencrypt/updateAccount', {  //Validate registration and update contact
        method: 'post',
        body: JSON.stringify({
          loc: this.$store.state.Loc + this.$store.state.AccName + '/',  
          domain : this.$store.state.Domain,
          account: this.$store.state.Account,
          directories: this.$store.state.Directories,  
          cachebuster: this.cachebuster()
        }) 
      }).then((res) => (res.json()))
          .then((res) => { 

              if(res.success) { 
                this.makeSimpleToast('success', 'Account registration success!', 'b-toaster-top-center')
              } else { 
                this.makeSimpleToast('danger', 'Account registration failed! Proceed from next step?', 'b-toaster-top-center')
              }   
              this.showProcessing = false
              
          })
    },
    acceptTerms:function() { 
        if(this.tos_accept) 
          this.$emit('terms_accepted', true)
        else
          this.$emit('terms_accepted', false)
      },
    //Processing..
    onShown:function() {
      // Focus the cancel button when the overlay is showing
      this.$refs.cancel.focus()
    },
    onHidden:function() {
      // Focus the show button when the overlay is removed
      this.$refs.show.focus()
    },
    //A small toaster
    makeSimpleToast:function (variant = null, content, toaster) { 
      this.$bvToast.toast(content, {  title: ` ${variant || 'default'}`,  variant: variant,  toaster: toaster,  solid: true }) 
    },
    // url-safe base64 encoding
    cachebuster: function(){
        return "cachebuster=" + this.base64(window.crypto.getRandomValues(new Uint8Array(8)));
    },
    
  },
  mounted() { 
    this.updateAccount()
    this.$store.commit('updateAlertShow', false) 
  }
}

</script>