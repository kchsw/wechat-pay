// 云函数入口文件
const cloud = require('wx-server-sdk')
const util = require('./util.js')
const config = require('./config')
const request = require('request')
const xml = require('xml2js')

cloud.init()

function getPrePaySign(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no){
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
	return util.getSign(params, config.key)
}
function wxSendData(appid, attach, body, openid, total_fee, notify_url, ip, nonce_str, out_trade_no, sign){
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
}

function getPayParams(appId, prepay_id){
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


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  let total_fee = event.total_fee
  let nonce_str = util.createNonceStr()
	let out_trade_no = util.getTradeId('mp')
  const { appId, mch_id, key, appSecret, body, attach, notify_url, ip } = config
  //生成支付签名
  let sign = getPrePaySign(appId, attach, body, openId, total_fee, notify_url, ip, nonce_str, out_trade_no)
  //生成统一下单接口的xml
  let sendData = wxSendData(appId, attach, body, openId, total_fee, notify_url, ip, nonce_str, out_trade_no, sign)
  
  console.log('sendData:' + sendData)

  return new Promise((resolve, reject) => {
  	let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
  	request({
				url,
				method: 'POST',
				body: sendData
			}, (err, response, body) => {
				if(err){
					reject(err)
				}else{
					xml.parseString(body.toString('utf-8'), (error, res) => {
						if(!error){
							let data = res.xml
							if(data.return_code[0] == 'SUCCESS' && data.result_code[0] == 'SUCCESS'){
								//获取预支付会话ID
								let prepay_id = data.prepay_id[0]
								//生成小程序支付的SDK配置信息
								let payResult = getPayParams(appId, prepay_id)
								resolve(payResult)
							}else{
								let msg = data.return_msg || data.err_code_des
								reject(msg)
							}
						}
					})
				}
			})
  })

}