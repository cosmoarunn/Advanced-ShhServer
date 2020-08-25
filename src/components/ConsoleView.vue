<template>
  <div>           
    <b-sidebar id="sidebar-console"  bg-variant="dark" text-variant="light" aria-label="Command Console" title="console"  shadow right width="60%">
      <template v-slot:footer="{ hide }">
       <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
        <strong class="mr-auto">Footer</strong>
        <b-button size="sm" @click="hide">Close</b-button>
       </div>
      </template>
      <div class="bg-dark px-3 py-2"  >
      
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