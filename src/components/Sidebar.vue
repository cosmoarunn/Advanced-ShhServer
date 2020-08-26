<template>
  <div>           
    <b-sidebar id="sidebar-main" aria-label="Sidebar with custom footer" no-header shadow>
      <template v-slot:footer="{ hide }">
       <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
        <strong class="mr-auto">Footer</strong>
        <b-button size="sm" @click="hide">Close</b-button>
       </div>
      </template>
      <div class="px-3 py-2">
       <b-img src="../assets/images/logo-160.png" fluid thumbnail rounded="circle"></b-img>
      <b-nav vertical>
        <b-nav-item active><router-link to="/">Home</router-link> </b-nav-item>
        <b-nav-item><router-link to="/dashboard">Dashboard</router-link> </b-nav-item>
        <b-nav-item><router-link to="/postman">Postman</router-link> </b-nav-item>
        <b-nav-item><router-link to="/about">About</router-link></b-nav-item>
      </b-nav> 
      
        <p>
          
        </p>
       
      </div>
    </b-sidebar>
  </div>
</template>

<script>

export default({ 

  name: 'sidebar',
  props: { 
    'logo-small': { 
      type: String,
      default: './assets/logo-small.png',
      description:'Dashboard',
    } 
  }

})
</script>