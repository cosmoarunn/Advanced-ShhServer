<template>
  <div>
  <b-container fluid class="p-1 mt-4">
  <b-row>
    <b-col cols="2">History</b-col>
    <b-col cols="10">
      <b-card no-body>
        <b-tabs card size="sm">
          <b-tab title="untitled" active>
            <b-input-group class="m-1" >
              <template v-slot:prepend>
                  <b-dropdown text="METHOD" variant="outline-success">
                  <b-dropdown-item>GET</b-dropdown-item>
                  <b-dropdown-item>POST</b-dropdown-item>
                  <b-dropdown-item>PUT</b-dropdown-item>
                  <b-dropdown-item>PATCH</b-dropdown-item>
                  <b-dropdown-item>DELETE</b-dropdown-item>
                  <b-dropdown-item>COPY</b-dropdown-item>
                  <b-dropdown-item>HEAD</b-dropdown-item>
                  <b-dropdown-item>OPTIONS</b-dropdown-item>
                  <b-dropdown-item>LINK</b-dropdown-item>
                  <b-dropdown-item>UNLINK</b-dropdown-item>
                  <b-dropdown-item>PURGE</b-dropdown-item>
                  <b-dropdown-item>LOCK</b-dropdown-item>
                  <b-dropdown-item>UNLOCK</b-dropdown-item>
                  <b-dropdown-item>PROPFIND</b-dropdown-item>
                  <b-dropdown-item>VIEW</b-dropdown-item>
                  </b-dropdown>
              </template>
              <b-form-input v-model="url" type="text" ref="url" :state="urlValid" placeholder="Request url"  size="lg" @keyup.enter="validateEmail " ></b-form-input>

              <template v-slot:append>
                  <b-button href="#"  @click="validateEmail" :disabled="emValidated" variant="success" size="lg">Go</b-button>
              </template>
            </b-input-group>
            <Descript />
          </b-tab>
          
          <b-tab v-for="i in tabs" :key="'dyn-tab-' + i" :title="'untitled ' + i"> '
            Tab contents {{ i }}
            <b-button size="sm" variant="danger" class="float-right" @click="closeTab(i)">
              Close tab
            </b-button>
          </b-tab>

          <!-- New Tab Button (Using tabs-end slot) -->
          <template v-slot:tabs-end>
            <b-nav-item role="presentation" @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
          </template>

          <!-- Render this if no tabs -->
          <template v-slot:empty>
            <div class="text-center text-muted">
              There are no open tabs<br>
              Open a new tab using the <b>+</b> button above.
            </div>
          </template>
        </b-tabs>
      </b-card>
      </b-col>
    </b-row>
    </b-container>
  </div>
  
</template>


<script>
import Descript from "../components/ServerDemo/Descript.vue"
  export default { 
    name:"postman",
    components: { 
      Descript,
    },
    data() {
      return {
        tabs: [],
        tabCounter: 0
      }
    },
    methods: {
      closeTab(x) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i] === x) {
            this.tabs.splice(i, 1)
          }
        }
      },
      newTab() {
        this.tabs.push(this.tabCounter++)
      }
    }
  }
</script>