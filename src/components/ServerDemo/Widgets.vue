<template>
<div>
<b-card header="Client Apps" header-tag="header"  title="Title" >
    <ClientApps :apps="apps"/>
      <b-button href="#" variant="primary"> Add Client </b-button>
    </b-card>
  <b-card-group deck class="">
    

    <b-card title="Title" header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <h6 class="mb-0">Header Slot</h6>
      </template>
      <b-card-text>Header and footers using slots.</b-card-text>
      <b-button href="#" variant="primary">Go somewhere</b-button>
      <template v-slot:footer>
        <em>Footer Slot</em>
      </template>
    </b-card>
  </b-card-group>
</div>

</template>

<script>
import ClientApps from './ClientApp.vue'

export default ({
  name:'Widgets',
  components: { 
    ClientApps
  },
  data() { 
    return { 
      apps: [
        {id: 1, title: "Argon Dashboard", framework: "Vue @3.0", version: "1.0.1", path: "", installs: 3124, image: "logo-160.png", link: "https://165.22.35.93:3005/", variant: 'light'},
        {id: 2, title: "SHHServer", framework: "Node @12.0", version: "1.0.1", path: "", installs: 786, image: "../assets/images/logo-160.png", link: "https://165.22.35.93:3005/", variant: 'dark'},
        {id: 3, title: "OpenVPN Status", framework: "Vue @2.0", version: "2.1.0", path: "", installs: 3124, image: "../assets/images/logo-160.png", link: "https://165.22.35.93:3005/", variant: 'light'},
        {id: 4, title: "HTTPSGen", framework: "Vue @3.0", version: "1.0.1", path: "", installs: 3124, image: "../assets/images/logo-160.png", link: "https://165.22.35.93:3005/", variant: 'light'},
        {id: 5, title: "GoogiWallet", framework: "React @12.6", version: "1.0.1", path: "", installs: 3124, image: "../assets/images/logo-160.png", link: "https://165.22.35.93:3005/", variant: 'light'},
      ],
    }
  }
})


</script>
