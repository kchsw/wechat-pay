const express = require('express')
const request = require('request')
const cache = require('memory-cache')
const config = require('./config')
const common = require('../common/index')
const util = require("../../util/index")
const router = express.Router()
const mpconfig = Object.assign({}, config.mp)
const dao = require('../common/db')

//获取session接口
router.get('/getSession', (req, res) => {
	const { code } = req.query
	if(!code){
		res.json(util.handleFail('code不能为空', 10001))
	}else{
		let sessionUrl =  `https://api.weixin.qq.com/sns/jscode2session?appid=${mpconfig.appId}&secret=${mpconfig.appSecret}&js_code=${code}&grant_type=authorization_code`
		request(sessionUrl, (err, response, body) => {
			let result = util.handleResponse(err, response, body)
			res.json(result)
		})
	}
	
})

//授权登陆
router.get('/login', async (req, res) => {
	const userInfo = JSON.parse(req.query.userInfo)
	if(!userInfo){
		res.json(util.handleFail('用户信息不能为空', 10002))
	}else{
		let userRes = await dao.query({ "openid": userInfo.openid }, 'user_mp')
		if(userRes.code == 0){
			if(userRes.data.length > 0){
				res.json(util.handleSuc({
					userId: userRes.data[0]._id
				}))
			}else{
				let insertData = await dao.insert(userInfo, 'user_mp')
				if(insertData.code == 0){
					let result = await dao.query({ "openid": userInfo.openid }, 'user_mp')
					res.json(util.handleSuc({
						userId: result.data[0]._id
					}))
				}else{
					res.json(insertData)
				}
			}
		}else{
			res.json(userRes)
		}
	}
})



module.exports = router