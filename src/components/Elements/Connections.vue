<template>
  <div>
    
    <b-table :items="items" :busy="isBusy" class="mt-3" outlined>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong> Loading active connections..</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isBusy: true,
        items: [
          { Node: 'Dickerson', 'Started': '','Vpn IP': 'MacDonald', 'Public IP': 40, Connected: 'connected', Traffic: '399kiB', Actions: '' },
         
        ]
      }
    },
    methods: {
      toggleBusy() {
        this.isBusy = !this.isBusy
      }
    }
  }
</script>