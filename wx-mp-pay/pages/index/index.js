//index.js
//获取应用实例
const app = getApp()
let store = require('../../utils/store.js')
let Api = app.Api
let router = app.router
Page({
  data: {
    userId: store.getItem('userId')
  },
  onLoad: function () {
    if(!this.data.userId){
      this.getSession()
    }
  },
  getSession(){
    wx.login({
      success: (res) => {
        if(res.code){
          console.log(res.code)
          app.get(Api.getSession, {
            code: res.code
          }).then(res => {
            console.log(res)
            store.setItem('openId', res.openid)
          }).catch(res => {
            console.log('error:' + res.message)
          })
        }
      },
      fail: (res) => {   
      }
    })
  },
  getUserInfo(e){
    let userInfo = e.detail.userInfo
    userInfo.openid = store.getItem('openId')
    app.get(Api.login, {
      userInfo
    }).then(res => {
      store.setItem('userId', res.userId)
      this.setData({
        userId: res.userId
      })
    })
  },
  goToActivity(){
    router.push('activity')
  },
  goToRecharge(){
    router.push('pay')
  },
  onShareAppMessage: function () {
    return {
      title: '欢迎体验',
      path: '/pages/index/index',
      imageUrl: '/assets/image/share_mp_logo.png'
    }
  }
})
