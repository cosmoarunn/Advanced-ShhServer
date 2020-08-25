 module.exports = {
    devServer: {
        compress: true,
        disableHostCheck: true,   
        public: 'ovpnman.arunpanneerselvam.com'
    },
    
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],

    externals: {
      "sqlite3" : "require('sqlite3')"
      "sequelize": "require('sequelize')",
    },
    
    
  }