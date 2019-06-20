//index.js
//获取应用实例
const app = getApp()
let store = require('../../utils/store.js')
let Api = app.Api
// let router = app.router
let router = require('../../utils/router')
Page({
  data: {
    userId: store.getItem('userId')
  },
  onLoad: function () {
   this.getOpenId()
  },
  getOpenId(){
    wx.cloud.callFunction({
      name: 'getOpenId',
      data: {name: 'jack'},
      success: res => {
        console.log(res)
        console.log('[云函数] [getOpenId] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [getOpenId] 调用失败', err)
      }
    })
  },
  getUserInfo(e){
    //第一步获取用户信息
    let user = e.detail.userInfo
    //第二步调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: { user },
      success: res => {
        console.log(res)
        store.setItem('userId', res.result.userId)
        this.setData({
          userId: res.result.userId
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', JSON.stringify(err))
      }
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
