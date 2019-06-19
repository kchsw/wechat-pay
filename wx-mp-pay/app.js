//app.js
let Api = require('./http/api.js')
let request = require('./http/request.js')
let config = require('./env/index.js')
let router = require('./utils/router')
let env = 'Dev'
App.version = '1.0.0' //开发版本
App.config = config[env] //根据环境变量获取对应的配置信息
App.config.env = env
App.config.mockApi = config.mockApi

App({
  config: config[env],
  Api: Api,
  router,
  get: request.fetch,
  post: (url, data, option) => {
    option.method = 'POST'
    return request.fetch(url, data, option)
  },
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null
  }
})