const express = require('express')
const request = require('request')
const cache = require('memory-cache')
const config = require('./config')
const common = require('../common/index')
const util = require("../../util/index")
const router = express.Router()

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


module.exports = router