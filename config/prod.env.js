'use strict'
const authConfig = require('./auth.config')

module.exports = {
   NODE_ENV: '"production"',
   MENU_CONFIG: '"prod"',
   DEFAULT_USERNAME: `"${authConfig.DEFAULT_USERNAME}"`,
   DEFAULT_PASSWORD: `"${authConfig.DEFAULT_PASSWORD}"`
}
