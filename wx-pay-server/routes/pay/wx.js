const express = require('express')
const request = require('request')
const cache = require('memory-cache')
const config = require('./config')
const common = require('../common/index')
const util = require("../../util/index")
const createHash = require('create-hash')
const dao = require('../common/db')
const router = express.Router()
const wxpay = require('../common/wxpay.js')
const xml = require('xml2js')


router.get('/test', (req, res) => {
	res.json({
		code: 100,
		message: "test"
	})
})

//用户授权重定向
router.get('/redirect', (req, res) => {
	let redirectUrl = req.query.url,
		scope = req.query.scope,
		callback = 'http://m.imooc.com/api/wechat/getOpenId'
		cache.put('redirectUrl', redirectUrl)

	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wx.appID}&redirect_uri=${callback}&response_type=code&scope=${scope}&state=STATE#wechat_redirect `
	res.redirect(authorizeUrl)
})

//根据code获取用户的OpenId
router.get('/getOpenId', async (req, res) => {
	let code = req.query.code
	console.log("code:" + code)
	// let token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wx.appID}&secret=${config.wx.appsecret}&code=${code}&grant_type=authorization_code`
	if(!code){
		res.json(util.handleFail('当前未获取到授权code码'))	
	}else{
		// request.get(token_url, (err, response, body) => {
			// if(!err && response.statusCode == '200'){
			// 	let data = JSON.parse(body)
			// 	console.log('body:' + body)
			// 	let expire_time = 1000 * 60 * 60				
			// 	res.cookie('openId', data.openid, { maxAge: expire_time })
			// 	let redirectUrl = cache.get('redirectUrl')
			// 	res.redirect(redirectUrl)		
			// }else{

			// }

		// })
		let result = await common.getAccessToken(code)
		console.log(result)
		if(result.code == 0){
			let data = result.data
			let expire_time = 1000 * 60 * 60 * 2

			cache.put('access_token', data.access_token, expire_time)
			cache.put('openid', data.openid, expire_time)						
			res.cookie('openId', data.openid, { maxAge: expire_time })
			let userRes = await dao.query({ "openid": data.openid }, 'user')
			if(userRes.code == 0){
				console.log(userRes.data)
				if(userRes.data.length > 0){

				}else{
					let userData = await common.getUserInfo(data.access_token, data.openid)
					let insertData = await dao.insert(userData.data, 'user')
					if(insertData.code == 0){

					}else{
						res.json(insertData)
					}
				}
			}else{
				res.json(userRes)
			}
			let redirectUrl = cache.get('redirectUrl')
			res.redirect(redirectUrl)
		}else{
			res.json(result)
		}		
	}
})

router.get('/getUserInfo', async (req, res) => {
	let access_token = cache.get('access_token'),
 		openid = cache.get('openid')
	let result = await common.getUserInfo(access_token, openid)
	res.json(result)
})

router.get('/jssdk', async (req, res) => {
	let url = req.query.url
	let result = await common.getToken()
	if(result.code == 0){
		let token = result.data.access_token
		cache.put('token', token)
		let result2 = await common.getTicket(token)
		if(result2.code == 0){
			let data = result2.data
			let params = {
				noncestr: util.createNonceStr(),
				jsapi_ticket: data.ticket,
				timestamp: util.createTimeStamp(),
				url
			}
			let str = util.raw(params)
			let sign = createHash('sha1').update(str).digest('hex')
			res.json(util.handleSuc({
				appId: config.wx.appID,
				timestamp: params.timestamp,
				nonceStr: params.noncestr,
				signature: sign,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'chooseWXPay'
				]
			}))
		}else{
			res.json(result2)
		}
	}else{
		res.json(result)
	}
})

router.get('/pay/payWallet', (req, res) => {
	let openid = req.cookies.openId //用户的openid
	let attach = '小程序支付' //附加数据
	let body = '小程序支付' //支付主题内容
	let total_fee = req.query.money //支付总金额
	let notify_url = "http://localhost:3000/api/mp/pay/callback"
	let ip = '123.57.2.144'
	let appid = config.wx.appId //应用id
	wxpay.order(appid, attach, body, openid, total_fee, notify_url, ip).then(result => {
		res.json(util.handleSuc(result))
	}).catch(result => {
		res.json(util.handleFail(result))
	})
})

//接受微信支付成功后的回调的接口
router.post('/pay/callback', async (req, res) => {
	xml.parseString(req.rawBody.toString('utf-8'), (error, res) => {
		if(error){
			res.send('fail')
			return
		}
		let data = res.xml
		let order = {
			openId: data.openid[0],
			totalFee: data.total_fee[0],
			isSubscribe: data.is_subscribe[0],
			orderId: data.out_trade_no[0],
			transactionId: data.transaction_id[0],
			tradeType: data.trade_type[0],
			timeEnd: data.time_end[0]
		}
		//保存订单信息到数据库
		let result = await dao.insert(order, 'orders')
		if(result.code == 0){
			let data = 	`<xml>
						  <return_code><![CDATA[SUCCESS]]></return_code>
						  <return_msg><![CDATA[OK]]></return_msg>
						</xml>`
			res.send(data)
		}else{
			res.send('fail')
		}
	})
})


module.exports = router