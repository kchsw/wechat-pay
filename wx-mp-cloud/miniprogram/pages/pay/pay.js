// pages/pay/pay.js
const app = getApp()
let store = require('../../utils/store.js')
let Api = require('../../http/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    amount: 0
  },
  getMoney(e){
    let amount = e.detail.value * 100
    this.setData({
      amount,
      index: amount 
    })
  },
  choose(e){
    let amount = e.currentTarget.dataset.amount
    this.setData({
      amount,
      index: amount
    })
  },
  pay(){
    let amount = this.data.amount
    console.log(amount)
    if(!amount && !/^\d*$/.test(amount)){
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none'
      })
      return
    }else if(amount <= 0){
      wx.showToast({
        title: '输入的金额必须大于0',
        icon: 'none'
      })
      return
    }
    wx.cloud.callFunction({
      name: '',
      data: {
        total_fee: amount
      },
      success: res => {
        res = res.result
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: 'MD5',
          paySign: res.paySign,
          success(res){
            if(res.errMsg == 'requestPayment:ok'){
              wx.showToast({
                title: '支付成功'
              })
            }
          },
          fail(res){
            if(res.errMsg == 'requestPayment:fail cancel'){
              wx.showToast({
                title: '支付取消',
                icon: 'none'
              })
            }else{
              wx.showToast({
                title: res.errMsg,
                icon: 'none'
              })
            }
          }
        })  
      },
      fail: err => {

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})