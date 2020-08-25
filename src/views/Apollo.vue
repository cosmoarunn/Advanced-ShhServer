<template>
  <div>
   <ApolloVue />
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import ApolloVue from '../components/ApolloExample.vue'

  export default({ 
    name: 'Appollo',
    components: { 
      ApolloVue,
    },
    data() { 
      return { 
        
      }
    }
  })
</script>