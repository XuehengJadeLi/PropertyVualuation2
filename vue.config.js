// vue.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  configureWebpack: {
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('')
      })
    ],
    resolve: {
      alias: {
        // Cesium module name
        cesium: path.resolve(__dirname, 'node_modules/cesium')
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
};