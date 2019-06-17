<template>
	<div id="index">
		<img src="@/assets/img/header.png" class="header" alt="">
		<div class="btn-group">
			<button class="btn">分享</button>
			<button class="btn btn-primary">充值</button>
			<button class="btn">活动详情</button>
		</div>
	</div>
</template>

<script>
	import API from '../api/index'
	import wx from 'weixin-js-sdk'
	import util from '../util/index'
	export default {
		name: 'index',
		data(){
			return {
				userInfo: ''
			}
		},
		mounted(){
			if(this.$cookie.get('openId')){
				this.getUserInfo()
			}
		},
		methods: {
			getUserInfo(){
				this.$http.get(API.getUserInfo).then(res => {
					console.log(res)
				})
			}
			// checkUserAuth(){
			// 	let openId = this.$cookie.get('openId')
			// 	if(!openId){
			// 		window.location.href = API.wechatRedirect
			// 	}else{
			// 		// this.getWechatConfig()
			// 	}
			// },

			// getWechatConfig(){
			// 	this.$http.get(API.wechatConfig + '?url=' + location.host).then(response => {
			// 		let res = response.data
			// 		if(res.code == 0){
			// 			const { appId, timestamp, nonceStr, signature, jsApiList } = res.data
			// 			wx.config({
			// 			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			// 			    appId, // 必填，公众号的唯一标识
			// 			    timestamp, // 必填，生成签名的时间戳
			// 			    nonceStr, // 必填，生成签名的随机串
			// 			    signature,// 必填，签名
			// 			    jsApiList // 必填，需要使用的JS接口列表
			// 			})
			// 			wx.ready(() => {
			// 				util.initShareInfo()
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss" scoped>
	@import '../assets/style/common.css';
	#index{
		height: 100vh;
		background-color: #ffc83a;
		.btn-group{
			text-align: center;
			padding-top: 17px;
			display: flex;
    		flex-direction: column;
    		align-items: center;
			.btn{
				margin-bottom: 25px;
			}
		}
	}
</style>