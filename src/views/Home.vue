<template>
  <div>
  
  <Widgets />

  <b-card-group>
    <b-card no-body class="m-5 p-5 overflow-hidden" >
      <b-row no-gutters>
        <b-col md="6">
          <b-icon stacked icon=" diagram3-fill" shift-h="2" variant="danger"></b-icon>
        </b-col>
        <b-col md="6">
          <b-card-body title="Dynamic Routes">
            <b-card-text>
               Generate Dynamic Routes much easier.
            </b-card-text>
            
          </b-card-body>
        </b-col>
      </b-row>
      
    </b-card>
    <b-card no-body class="m-5 p-5  overflow-hidden">
      <b-row no-gutters>
        <b-col md="6">
           <b-icon stacked icon=" diagram3-fill" shift-h="2" variant="danger"></b-icon>
        </b-col>
        <b-col md="6">
          <b-card-body title="Custom">
            <b-card-text>
              You can use your Public key and CSR to generate LetsEncrypt SSL Certificates for any domain!
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
      <template v-slot:footer>
        <b-container>
          <b-row>
          <b-col sm="7"> </b-col>
            <b-col sm="5"> <b-button href="#"   @click.native="$router.push('/httpsgen/').catch(()=>{})" variant="success"> Go &raquo;</b-button>  </b-col>
          </b-row>
        </b-container>
        
      </template>
    </b-card>
  </b-card-group>
  <b-card v-if="showHero == true"
      overlay
      img-src="../assets/images/banner01.png"
      img-alt="ASHH Server"
      text-variant="light"
      title="ASHH Server"
      sub-title="An all-to-one Development Server"
    >
      <b-card-text>
          - ASHH is a ready-to-deploy webserver development package for server-side scripting built using NodeJS/Express and backboned with Webpack.
          Simultaneous deployments of ReactJS/VueJS/VeuX. 
          - Apollo GraphQL support is added as an extra layer of Server Side Scripts 
          - Can be Immediately deployed on both webserver and localhost/container and start developing apps on any development platform
          - A one-to-all server
      </b-card-text>
    </b-card>
  </div>
</template>
 
<script>

import Widgets from '../components/ServerDemo/Widgets.vue'

export default ({ 
  name: 'Home',
  components: { 
    Widgets,
  },
  data() { 
    return { 
      showHero: 1,
    }
  }
})

</script>
