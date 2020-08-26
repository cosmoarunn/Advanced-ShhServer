export default  { 
    data(){ 
    return { 
      
    }
  },
  computed: { 
    cachebuster: function(){
        return "cachebuster=" + this.b64(window.crypto.getRandomValues(new Uint8Array(8)));
    },
  },
  methods: { 
    
    // url-safe base64 encoding
    base64:function(bytes){
        var str64 = typeof(bytes) === "string" ? window.btoa(bytes) : window.btoa(String.fromCharCode.apply(null, bytes));
        return str64.replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
    },
    Toast:function(variant = null, content, toaster) { 
      this.$bvToast.toast(content, {  title: ` ${variant || 'default'}`,  variant: variant,  toaster: toaster,  solid: true }) 
    },
    camelCase: str => str.charAt(0).toUpperCase() + str.slice(1),
    copyToclip: el => { //Copy from a text area
      var text = document.getElementById(el).text()
        try { 
          navigator.clipboard.writeText(text).then(function() {
          console.log('Async: Copying to clipboard was successful!');
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
          });
        }catch(e) { 
          el.focus(); el.select()
          var isCopied = document.execCommand('copy');
          return isCopied?1:0
        }finally{ 
          console.error("Couldn't copy anyway!");
        } 
       
      
    },
    OpenInNewTab: uri => window.open(uri, "_blank"),
    
   /*
    computedProps: props => { //(propName, value)
      var retProps = []
      for (var {name,method,value} in props)         
        retProps.push({    
          get() { return  this.$store.state[name]; }, 
          set() {   this.$store.commit(method,(value)?value:undefined) } 
        })
         return { computed: retProps }
      }, */
  }
}