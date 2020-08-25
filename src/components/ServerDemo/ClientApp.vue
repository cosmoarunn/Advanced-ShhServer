<template>
<div class="mt-3">
    <b-card-group fluid flex deck class="mb-3">
      <b-card  v-for="app in apps" :key="app.id"  class="text-left" style="cursor:pointer">
        <b-container :border-variant="app.variant" >
        <h6>{{app.title}} <b-badge class="ml-2"> {{app.version}}</b-badge></h6>
          <b-row>
            <b-col cols="8" class="p0 m0">
              <p>{{app.framework}}</p>
              
            </b-col>
            <b-col cols="4">
              <b-img :src="app.image" fluid thumbnail rounded="circle" >  </b-img>
              
            </b-col>
          </b-row>
        </b-container>
        <b-card-text>
          <b-row> 
            <b-col class="text-left">
            <p class="h2 mb-0"><b-icon icon="exclamation-circle-fill" variant="danger" size="lg"></b-icon></p>
            </b-col>
            <b-col class="text-center" ></b-col>
            <b-col class="text-left"><b-button rounded variant="success" size="sm" class="mt-2">Install</b-button></b-col>
          </b-row>
        </b-card-text>
        <b-progress :value="30" :variant="warning" :key="warning"  height="2px" class="m-0"></b-progress>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default ({ 
  name: "clientapp",
  data(){
    return { 
      
    }
  },
  props: {
    apps: [],
  },
  methods: { 
    resolveImage(img, imgPath = "../../assets/images/") { 
      let images = require.context(imgPath, false, /\.svg$|\.png$/)     
      return images("./"+ img)
    },
  },
})
</script>