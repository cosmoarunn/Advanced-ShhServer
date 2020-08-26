<template>
  <b-overlay :show="showProcessing" rounded="sm" @shown="onShown" @hidden="onHidden">
  <div> 
    
    <b-input-group class="m-1" >
      <template v-slot:prepend>
          <b-input-group-text >Account Email :</b-input-group-text>
      </template>
      <b-form-input v-model="email" type="email" ref="email" :state="emValidated" placeholder="you@example.com"  size="lg" @keyup.enter="validateEmail " ></b-form-input>

      <template v-slot:append>
          <b-dropdown text="Recent" variant="outline-info">
          <b-dropdown-item>-None-</b-dropdown-item>
          </b-dropdown>
          <b-button href="#"  @click="validateEmail" :disabled="emValidated" variant="success" size="lg">Go</b-button>
      </template>
    </b-input-group>

    <b-input-group class="m-1" >
      <template v-slot:prepend>
          <b-input-group-text >Account Secret: </b-input-group-text>
      </template>
      <b-form-input v-model="secret" type="text"  :state="secret.length >= 64 " ref="accName" @blur="validateSecret"  placeholder="Account Secret "   size="lg"></b-form-input>
    </b-input-group>
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
          @click="show = false"
        >
          Cancel
        </b-button>
      </div>
    </template>  
  </b-overlay>
</template>

<script>
export default ({ 
  props: { 
    show: Boolean,
  },
  data() { 
    return { 
      secret: '',
      //email: 'arun@fgmonuments.uk',
      emValidated: false,
      showProcessing: false,
      message: '',
    }
  },
   computed:  {  
    AccName: {  get () {  return this.$store.state.AccName },  set (value) { this.$store.commit('updateAccName', value)} },
    email: {  get () {  return this.$store.state.Email },  set (value) {  this.$store.commit('updateEmail', value) } }, 
    recents: {  get () {  return this.$store.state.recentEmails },  set (value) {  this.$store.commit('updateRecentEmails', value) } }, 
    //computedProps([{ 'name': 'AccName', 'method': 'updateAccName', 'value': 'computed'}])   //'Email','subtleCrypto',
  },
  watch: {  },
  methods: { 
    updateAccName:function(an) {
        this.$store.commit('updateAccName', an)
    },
    validateSecret:function(e) { 
         var reName = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
         this.name = (e.target.value !== "" && reName.test(e.target.value))?e.target.value: Math.random().toString(36).substring(7)
         e.target.value = this.name
         this.updateAccName(this.name)
    },
    validateEmail: function() { 
      this.message = "Checking for a valid email..";  this.showProcessing = true
      
      fetch('https://165.22.35.93:3030/letsencrypt/validateEmail', { 
        method: 'post',
        body: JSON.stringify({
              email: this.email.replace(/(<([^>]+)>)/gi, ""),
          }) 
      }).then((res) => (res.json()))
          .then((res) => { 
              
              this.emValidated = res.success?true:false
              if(res.success) { 
                this.message = "Email validated successfully!"
                this.$emit('email_validated', true)
                this.$emit('accName', this.name.replace(/(<([^>]+)>)/gi, ""))
              } else { 
                this.message = "Invalid email!"
              }
              this.msgClass = res.success?'success':'danger'             
              this.message = res.msg
              this.showProcessing = false  
          })
          
    },
    onShown:function() { this.$refs.cancel.focus() },
    onHidden:function() { this.$refs.email.$el.focus()  },
    
  },
  mounted() { 
      this.$refs.accName.$el.focus()
  }
})
</script>