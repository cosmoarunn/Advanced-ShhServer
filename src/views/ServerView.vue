<template>
  <div>
    <b-jumbotron>
      <template v-slot:header>Server</template>

      <template v-slot:lead>
        This server is up &amp; running for 97 days, 21 hrs and 31 mins.
      </template>

      <hr class="my-4">

      <p>
        It uses utility classes for typography and spacing to space content out within the larger
        container.
      </p>

      <b-button variant="primary" href="#">Do Something</b-button>
      <b-button variant="success" href="#">Do Something Else</b-button>
    </b-jumbotron>
  

<transition name="vue-ui-fade" appear>
    <b-card  v-if="server != null" p-2  
      bg-variant="light" text-variant="success"  no-body style="max-width: 20rem; max-height: 300px; cursor:pointer" > 
      <template v-slot:header>
        <h4 class="mb-0">{{server.name}}</h4>
      </template>
      
      <b-card-body>
        <b-card-title>{{server.hostname}}
          <b-icon icon="question-circle" aria-label="Help"></b-icon>
        </b-card-title>
        <b-card-sub-title class="mb-2">Port: {{server.port}}</b-card-sub-title>
        <b-card-text v-if="false">
          If the server hosted on the same machine, it will be <code>0.0.0.0</code> meaning that the ipaddress 
          of the machine running this website.
        </b-card-text>
      </b-card-body>

      <b-card-body class="p-0">
        <b-img :src="resolveSrvImage()" width="40" rounded="rounded" alt="Circle image"></b-img>
      </b-card-body>
      
      <b-list-group flush v-if="false">
        <b-list-group-item><svg data-v-bc4e6392="" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="wifi" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-wifi mx-auto b-icon bi"><g data-v-bc4e6392=""><path d="M15.385 6.115a.485.485 0 0 0-.048-.736A12.443 12.443 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.717 2.164.204.148.489.13.668-.049z"></path><path d="M13.229 8.271c.216-.216.194-.578-.063-.745A9.456 9.456 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336c.205.132.48.108.652-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.472 6.472 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.408.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.611-.091l.015-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .708 0l.707-.707z"></path></g></svg>
         VPN Server Running: {{server.status}}</b-list-group-item>
        <b-list-group-item>Connections: 0 ({{server.connections}})</b-list-group-item>
        <b-list-group-item>Data Transferred: 145,547,587 kiBytes</b-list-group-item>
        <b-list-group-item><b-button class="m-1" variant="outline-warning">Stop Accepting new Connections</b-button></b-list-group-item>
      </b-list-group>
      
      <b-card-body>
        03:04:31:25 <b-icon id="po-maint-target" icon="question-circle" aria-label="Help"></b-icon>
        <b-popover target="po-maint-target" triggers="hover" placement="top">
          <template v-slot:title>Server Maintenance</template>
            The time until the server shutdown for planned maintenance!
        </b-popover>
      </b-card-body>

      <b-card-footer> 
        <b-button size="sm" class="m-1" variant="primary">{{(server.status)?'Stop':'Start'}} Server</b-button>
        <b-button size="sm" class="m-1" variant="danger">Destroy</b-button>
      </b-card-footer>
    </b-card>
  </transition>

  </div>
</template>

<script>
export default { 
  data() { 
    return { 
       serverOn: false,
       
    }
  },
  props: { 
    server: null,
    serverOnImg: { 
      type: String,
      default: '../../assets/images/vpn/server-on.svg',
      description:'Server On',
    },
     
  },
  computed: { 
    
  },
  methods: { 
    resolveSrvImage() { 
      var _img;
      let images = require.context('../assets/images/vpn/', false, /\.svg$|\.png$/)
      if(this.server.status) { 
        _img = 'server-on.svg'

      } else { 
        _img = 'server-off.svg'
      }
      
      return images("./"+_img)
    },
    
  },
  mounted: { 
    
  }
}


/*
resolveSrvProps() { 
      var _variants;
      let images = require.context('../../assets/images/vpn/', false, /\.svg$|\.png$/)
      if(this.server.status) { 
       
       _variants = { image: images("./server-on.svg"), variant : 'success', txtVariant: 'success', borderVariant: 'success' }
      } else { 
         
       _variants = { image: images("./server-off.svg"), variant : 'light', txtVariant: 'dark', borderVariant: 'dark' }
      }
      
      this.variants = _variants;
    },

    */
</script>
