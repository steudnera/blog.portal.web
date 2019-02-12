/**
 * 配置
 * @author Philip
 */
'use strict'

const path = require('path')
const env_dev = require('./dev.env.js')
const env_prod = require('./prod.env.js')

module.exports = {
  dev: {
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {},
    host: 'localhost',
    port: 8081,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true,
    env: env_dev
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
    env: env_prod
  }
}
