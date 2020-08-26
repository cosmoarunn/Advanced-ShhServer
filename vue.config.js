module.exports = {
  outputDir: "public",

  devServer: {
   public: "0.0.0.0",
   proxy: {
     "^/ovpnman": {
       target: "http://0.0.0.0:7070",
       changeOrigin: true,
       logLevel: "debug",
       pathRewrite: { "^/ovpnman": "/" }
     }
   }
 },

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true
    }
  },
/*
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        }

        return options
      })
      
  }*/
} 
