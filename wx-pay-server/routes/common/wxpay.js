//微信小程序、H5通用封装
const request = require('request')
let config = require('../pay/config')
const util = require("../../util/index")
const createHash = require('create-hash')
const xml = require('xml2js')
config = config.mch
module.exports = {
	order(appid, attach, body, openid, total_fee, notify_url, ip){
		return new Promise((resolve, reject) => {
			let nonce_str = util.createNonceStr()
			let out_trade_no = util.getTradeId('mp')
			let sign = this.getPrePaySign(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no)
			//通过参数和签名组装xml数据，用以调用统一下单接口
			let sendData = this.wxSendData(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no, sign)
			let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'	
			request({
				url,
				method: 'POST',
				body: sendData
			}, (err, response, body) => {
				if(!err && response.statusCode == 200){
					xml.parseString(body.toString('utf-8'), (error, res) => {
						if(!error){
							let data = res.xml
							if(data.return_code[0] == 'SUCCESS' && data.result_code[0] == 'SUCCESS'){
								//获取预支付会话ID
								let prepay_id = data.prepay_id[0]
								let payResult = this.getPayParams(appid, prepay_id)
								resolve(payResult)
							}
						}
					})
				}else{
					resolve(util.handleFail(err))
				}
			})
		})
		
	},
	//生成预支付签名
	getPrePaySign(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no){
		let params = {
			appid,
			attach,
			body,
			mch_id: config.mch_id,
			nonce_str,
			notify_url,
			openid,
			out_trade_no,
			spbill_create_ip: ip,
			total_fee,
			trade_type: 'JSAPI'
		}
		// let string = util.raw(params) + '&key=' + config.key 
		// let sign = createHash('md5').update(string).digest('hex')
		// return sign.toUpperCase()
		return util.getSign(params, config.key)
	},
	//签名成功后，根据参数拼接组装成XML格式的数据，调用下单接口
	wxSendData(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no, sign){
		let data = `
			<xml>
			   <appid><![CDATA[${appid}]]></appid>
			   <attach><![CDATA[${attach}]]></attach>
			   <body><![CDATA[${body}]]></body>
			   <mch_id><![CDATA[${config.mch_id}]]></mch_id>
			   <nonce_str><![CDATA[${nonce_str}]]></nonce_str>
			   <notify_url><![CDATA[${notify_url}]]></notify_url>
			   <openid><![CDATA[${openid}]]></openid>
			   <out_trade_no><![CDATA[${out_trade_no}]]></out_trade_no>
			   <spbill_create_ip><![CDATA[${ip}]]></spbill_create_ip>
			   <total_fee><![CDATA[${total_fee}]]></total_fee>
			   <trade_type><![CDATA[JSAPI]]></trade_type>
			   <sign><![CDATA[${sign}]]></sign>
			</xml>
		`
		return data
	},
	getPayParams(appId, prepay_id){
		let params = {
			appId,
			timeStamp: util.createTimeStamp(),	
			nonceStr: util.createNonceStr(),
			package: `prepay_id=${prepay_id}`,
			signType: 'MD5'
		}
		let paySign = util.getSign(params, config.key)
		params.paySign = paySign
		return params
	}
}