<template>
<div>

    <ApolloMutation v-if="!authorized"
      :mutation="require('../../graphql/SignIn.gql')"
      :variables="{
        email: this.email,
        password: this.password
      }"
      class="form"
      @done="proceed"
    >
    <template slot-scope="{ mutate,loading,error }">
    <b-dropdown id="dropdown-form" text="Signin" ref="dropdown" variant="outline-light" right class="m-2">
      <b-dropdown-form v-on:submit.prevent="formValid && mutate()">
        <b-form-group label="Email" label-for="dropdown-form-email" @submit.stop.prevent>
          <b-form-input v-model="email" autocomplete="true"
            id="dropdown-form-email"
            size="sm"
            placeholder="email@example.com"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="password" label-for="dropdown-form-password">
          <b-form-input v-model="password" autocomplete="true"
            id="dropdown-form-password"
            type="password"
            size="sm"
            placeholder="Password"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
        <b-button :disabled="loading" type="submit" variant="primary" size="sm" >Sign In</b-button>
          <b-alert v-if="error" show variant="danger">An error occurred: {{ error }}</b-alert> 
          
      </b-dropdown-form>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button>New around here? Sign up</b-dropdown-item-button>
      <b-dropdown-item-button>Forgot Password?</b-dropdown-item-button>
    </b-dropdown>
     </template>
    </ApolloMutation>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { onLogin } from '../../vue-apollo.js'

  export default {
    name: 'logininline',
    data() {
      return { 
        me: null,
        email: '',
        password: '',
      }
    },
    apollo: { 
      me: gql`query me {
          me { 
            email 
          } 
        }`
    },
    computed: {
      formValid () {
        return { email: this.email, password: this.password}
      },
      authorized: { get() { return this.$store.state.authorized } }
    },
    methods: {
      proceed(response){
        // Result
        this.password = ''
        if(response.data.signin !== "") { 
          onLogin(this.$apollo.provider.defaultClient, response.data.signin)
          this.$router.push('/dashboard')
          this.$store.commit('updateAuthorized', true)
        } else { 
          this.$store.commit('updateAuthorized', false)
          console.log(response)
        }
      },

      onClick() {
        // Close the menu and (by passing true) return focus to the toggle button
        this.$refs.dropdown.hide(true)
      }
    },
    
  }
</script>