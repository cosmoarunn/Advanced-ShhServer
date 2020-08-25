<template>
  <div>
    <b-container class="p-5 bv-example-row">
      <b-form-group label="Email" label-for="Email" @submit.stop.prevent>
        <b-form-input v-model="Email"
          id="Email"
          size="sm"
          placeholder="email@example.com"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Password" label-for="Password">
        <b-form-input v-model="Password" autocomplete="current-Password"
          id="Password"
          type="Password"
          size="sm"
          placeholder="Password"
        ></b-form-input>
      </b-form-group>

      <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
      <b-button variant="primary" size="sm" @click="login">Sign In</b-button>
    </b-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { onLogin } from '../vue-apollo.js'

  export default {
    name: 'loginMain',
    data() {
      return { 
        me: null,
        Email: '',
        Password: '',
      }
    },
    computed: {
      authorized: { get() { return this.$store.state.authorized }, set() { }}
    }, 
    apollo: { 
      
    },
    methods: {
      login() {
        this.$apollo.mutate({
          // Query
          mutation: gql`mutation signin($Email: String!, $Password: String!) { 
            signin(email: $Email, password: $Password) 
            } 
          `,
          // Parameters
          variables: {
            Email: this.Email,
            Password: this.Password
          },
          
        }).then((response) => {
          // Result
          if(response.data.signin !== "") { 
            onLogin(this.$apollo.provider.defaultClient, response.data.signin)
            this.$store.commit('updateAuthorized', true)
            this.$router.push('/dashboard')
          } else { 
            if (typeof localStorage !== 'undefined') {
              localStorage.removeItem('apollo-token')
            }
            this.$store.commit('updateAuthorized', false)
            console.log(response)
          }
        }).catch((error) => {
          // Error
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('apollo-token')
          }
          this.$store.commit('updateAuthorized', false)
          console.error(error)
          // We restore the initial user input
          
        })
      },
      
    },
    mounted() { 
      if(this.authorized)
        this.$router.push('/dashboard')
    }
    
  }
</script>