/**
 * webpack 环境配置
 * @author Philip
 */
'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'forget-password.html',
      template: 'src/html/forget-password.html',
      chunks: ['rainbow-blender', 'forget-password'],
      xhtml: true
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'src/html/login.html',
      chunks: ['rainbow-blender', 'login'],
      xhtml: true
    }),
    new HtmlWebpackPlugin({
      filename: 'register.html',
      template: 'src/html/register.html',
      chunks: ['rainbow-blender', 'register'],
      xhtml: true
    }),
    new HtmlWebpackPlugin({
      filename: 'reset-password.html',
      template: 'src/html/reset-password.html',
      chunks: ['rainbow-blender', 'reset-password'],
      xhtml: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
