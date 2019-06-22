<template>
	<div class="recharge">
	    <div class="recharge-box">
	      <h2 class="title">充值金额</h2>
	      <div class="input-box">
	        <input class="input" type="number" placeholder="请输入充值金额" v-model="money">
	      </div>
	      <div class="item-num">
	        <span class="num" :class="index==1?'checked':''" @click="choose(1)">1分</span>
	        <span class="num" :class="index==20?'checked':'default'" @click="choose(20)">2毛</span>
	      </div>
	      <div class="item-num">
	        <span class="num" :class="index==100?'checked':'default'" @click="choose(100)">1元</span>
	        <span class="num" :class="index==500?'checked':'default'" @click="choose(500)">5元</span>
	      </div>
	      <button class="btn btn-primary btn-recharge" @click="pay">充值</button>
	      <p class="tip">点击充值即表示已阅读并同意<a class="protocol" href="javascript:;">充值协议</a></p>
	    </div>
	</div>
</template>

<script>
	import API from '../api/index'
	import wx from 'weixin-js-sdk'
	export default {
		name: 'pay',
		data(){
			return {
				money: '',
				index: 1
			}
		},
		methods: {
			choose(money){
				this.index = money
			},
			pay(){				
				// if(!/^\d*$/g.test(this.money)){
				// 	alert('请勿输入非法金额');
    //     			return 
				// }
				if(this.money && (this.money <= 0 || !/^[1-9]\d*$/g.test(this.money))){
					alert('情输入正确的金额格式');
        			return 
				}				
				this.$http.get(API.payWallet, {
					params: {
						money: this.money * 100 || this.index
					}
				}).then(res => {
					let result = res.data
					if(result && result.code == 0){
						//通过微信的jsapi拉起微信支付
						let res = result.data
						wx.chooseWXPay({
							timestamp: res.timeStamp, 
							nonceStr: res.nonceStr,
							package: res.package,
							signType: res.signType, 
							paySign: res.paySign, 
							success: (res) => {	

							},
							cancel: () => {

							},
							fail: (res) => {
								alert(res.message || '支付失败')
							}
						})
					}else{

					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.recharge{
	background: #fff;
	.recharge-box{
		padding: 0 15px;
		.title{
			font-size: 17px;
			color: #333;
			margin-top: 35px;
		}
		.input-box{
			text-align: center;
			margin-top: 25px;
			margin-bottom: 15px;
			.input{
				display: block;
				width: 350px;
				height: 50px;
				border: 1px solid #d7d7d7;
				border-radius: 5px;
				font-size: 15px;
				color: #333;
				text-align: center;
			}
		}
		.item-num{
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
			.num{
				height: 65px;
				background-color: #f1f3f5;
				color: #333;
				font-size: 16px;
				width: 167px;
				text-align: center;
				line-height: 65px;
				border-radius: 4px;
				&.checked{
					background-color: #ffebe8;
					color: #ff3418;
				}
			}
		}
		.btn{
			width: 270px;
			height: 50px;
			line-height: 50px;
			font-size: 17px;
			background-color: #fff;
			color: #ff3418;
			outline: none;
		    border: none;
		    border-radius: 25px;
		    padding: 0;
		    box-shadow: 5px 5px 9px 0px rgba(255, 106, 106, .57);
		    margin-bottom: 25px;
		}
		.btn-primary{
			background-color: #ff3418;
			color: #fff;
		}
		.btn-recharge{
			display: block;
			margin: 150px auto 24px;
			color: #fff;
			font-weight: 400;
			box-shadow: 0px 10px 18px 0 rgba(255, 106, 106, .57)
		}
		.tip{
			font-size: 14px;
			color: #999;
			text-align: center;
			.protocol{
				color: #ff3418;
			}
		}
	}
}	
</style>