const request = require('request')
const config = require('../pay/config')
const util = require("../../util/index")
module.exports = {
	getAccessToken(code){
		let token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wx.appID}&secret=${config.wx.appsecret}&code=${code}&grant_type=authorization_code`
		return new Promise((resolve, reject) => {
			request.get(token_url, (err, response, body) => {
				let result = util.handleResponse(err, response, body)
				resolve(result)
			})
		})			
	},
	getUserInfo(access_token, openid){
		let userinfo_url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
		return new Promise((resolve, reject) => {
			request.get(userinfo_url, (err, response, body) => {
				let result = util.handleResponse(err, response, body)
				resolve(result)
			})
		})
	}
}