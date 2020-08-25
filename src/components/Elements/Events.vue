<template>
  <div>
    
    <b-table :items="items" :busy="isBusy" class="mt-3" outlined>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isBusy: false,
        items: [
          { Node: 'Dickerson', 'Started': '', 'Ended': '', 'Vpn IP': '10.0.0.41', 'Public IP': '165.22.35.93', DataTransfer: '399kiB', Actions: '' },
          { Node: 'googi', 'Started': '', 'Ended': '', 'Vpn IP': '10.0.0.133', 'Public IP': '79.12.24.39', DataTransfer: '102167ki B', Actions: '' },
         
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