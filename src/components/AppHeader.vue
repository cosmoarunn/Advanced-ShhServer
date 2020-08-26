<template>
<div>
  <b-navbar class="bd-navbar"  toggleable="sm" type="dark" >
    <b-navbar-brand href="#" style="background:none" size="sm" v-b-toggle.sidebar-main>
      <b-img src="../assets/images/logo-160.png" style="height:65px!important; width:65px!important;" rounded="circle"  fluid-grow fluid thumbnail></b-img>
    </b-navbar-brand>
    <b-navbar-brand href="#" v-b-toggle.sidebar-main> SHH Server </b-navbar-brand>    
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Docs</b-nav-item>
        <b-nav-item href="#" disabled>Help</b-nav-item>
      </b-navbar-nav> 
      
      <!-- Right aligned nav items -->
      
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#"  v-b-toggle.sidebar-console> Console </b-nav-item>
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search" variant="warning"></b-form-input>
          <b-button size="sm" variant="warning" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown v-if="authorized" text="Lang" right variant="outline-light">
          <b-dropdown-item href="#"><b-img :src="en" rounded="circle"  fluid-grow fluid thumbnail></b-img> EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>
        <LoginInline />
        <div v-if="authorized">
          <b-dropdown size="lg" right variant="link" toggle-class="text-decoration-none" no-caret>
            <template v-slot:button-content>
              &#x1f467;<span class="sr-only">Search</span>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#" @click="signOut"><b-icon icon="power" aria-hidden="true"></b-icon> SignOut</b-dropdown-item>
            <b-dropdown-item href="#">Something else here...</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
</template>

<script>
import LoginInline from './Forms/LoginInline.vue'
import { onLogout } from '../vue-apollo.js'

export default({ 
  name: 'appHeader',
  components: { 
    LoginInline,
  },
  data() { 
    return { 
    }
  },
  props: { 
    'en': { 
      type: String,
      default: '../assets/lang/en.png',
      description:'lang-en',
    } 
  },
  computed: { 
    authorized: { get() { return this.$store.state.authorized }}
  },
  methods: { 
    
    signOut() { 
      onLogout(this.$apollo.provider.defaultClient)
      this.$store.commit('updateAuthorized', false)
      this.$router.push('/')
    }
  }

})
</script>

<style>
.bd-navbar {
    min-height: 4rem;
    background-color: #286c64;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,.05), inset 0 -1px 0 rgba(0,0,0,.1);
}
.bd-navbar {
    box-shadow: 0 0.25rem 0.25rem rgba(0,0,0,.25), inset 0 -1px 5px rgba(0,0,0,.25);
}
@media (min-width: 768px)
.bd-navbar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1071;
}
</style>