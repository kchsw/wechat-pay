const store = require('../utils/store.js')
const system = store.getSystemInfo()

const clientInfo = {
	'clientInfo': 'mp',
	'appnm': 'imoocpay',
	'model': system.model,
	'os': system.system,
	'screen': system.screenWidth + '*' + system.screenHeight,
	'version': App.version,
	'channel': 'miniprogram'
}
const errMsg = "服务异常，请稍后再试"
module.exports = {
	fetch:  (url, data={}, options={}) => {
		const {loading=true, toast=true, isMock=false, method="GET"} = options
		return new Promise((resolve, reject) => {
			if(loading){
				wx.showLoading({
					title: '加载中...',
					mask: true,
				})
			}
			let env = isMock ? App.config.mockApi : App.config.baseApi
			wx.request({
				url: env + url,
				data,
				method,
				header: {
					'clientInfo': JSON.stringify(clientInfo)
				},
				success: function(result){
					let res = result.data
					if(res.code == 0){
						if(loading){
							wx.hideLoading()
						}
						resolve(res.data)			
					}else{
						if(toast){
							wx.showToast({
								title: res.message,
								icon: 'none', 
								mask: true,
							})
						}else{
							wx.hideLoading()
						}
						reject(res)
					}
				},
				fail: function(e={ code: -1, msg: errMsg, errMsg }){
					let msg = e.errMsg
					if(msg == 'request: fial timeout'){
						msg = "服务异常，请稍后再试"
					}
					wx.showToast({
						title: msg,
						icon: "none", // "success", "loading", "none"					
					})
					reject(e)
				}
			})
		})
	}
}