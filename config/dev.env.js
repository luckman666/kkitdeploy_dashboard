'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_URL: '"https://dev-deveops.8531.cn/"',
  // API_WEBSOCKET: "'wss://dev-deveops.8531.cn/'",

  // API_URL: '"http://39.105.163.183:8001/"',
  // API_WEBSOCKET: "'wss://39.105.163.183:8001/'",

  API_URL: '"http://192.168.31.74:8080/"',
  API_WEBSOCKET: "'wss://192.168.31.74:8080/'",
  API_TIMEOUT: '"90000"'
})
