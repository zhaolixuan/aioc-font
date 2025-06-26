'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const authConfig = require('./auth.config')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEFAULT_USERNAME: `"${authConfig.DEFAULT_USERNAME}"`,
  DEFAULT_PASSWORD: `"${authConfig.DEFAULT_PASSWORD}"`
})
