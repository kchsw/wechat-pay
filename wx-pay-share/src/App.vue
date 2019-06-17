<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
	import API from './api/index'
	import wx from 'weixin-js-sdk'
	import util from './util/index'
	export default {
		data(){
			return {
				
			}
		},
		mounted(){
			// window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0c47e14930955c9f&redirect_uri=http%3A%2F%2Fm.imooc.com%2Findex&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect 
			// this.$http.get(API.test).then(res => {
			// 	console.log(res)
			// })
			this.checkUserAuth()
		},
		methods: {
			checkUserAuth(){
				let openId = this.$cookie.get('openId')
				if(!openId){
					window.location.href = API.wechatRedirect
				}else{
					// this.getWechatConfig()
				}
			},

			getWechatConfig(){
				this.$http.get(API.wechatConfig + '?url=' + location.host).then(response => {
					let res = response.data
					if(res.code == 0){
						const { appId, timestamp, nonceStr, signature, jsApiList } = res.data
						wx.config({
						    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						    appId, // 必填，公众号的唯一标识
						    timestamp, // 必填，生成签名的时间戳
						    nonceStr, // 必填，生成签名的随机串
						    signature,// 必填，签名
						    jsApiList // 必填，需要使用的JS接口列表
						})
						wx.ready(() => {
							util.initShareInfo()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
