const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
            to: path.join(__dirname, 'dist/cesium/Workers'),
            noErrorOnMissing: true
          },
          {
            from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Assets'),
            to: path.join(__dirname, 'dist/cesium/Assets'),
            noErrorOnMissing: true
          },
          {
            from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'),
            to: path.join(__dirname, 'dist/cesium/Widgets'),
            noErrorOnMissing: true
          },
          {
            from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/ThirdParty'),
            to: path.join(__dirname, 'dist/cesium/ThirdParty'),
            noErrorOnMissing: true
          }
        ]
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('/cesium/')
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  }
})