module.exports = {
	//对封装结果同意封装处理
	handleResponse(err, response, body){
		if(!err && response.statusCode == '200'){
			let data = JSON.parse(body)
			if(data && !data.errcode){
				return this.handleSuc(data)
			}else{
				return this.handleFail(data.errmsg, data.errcode)
			}
		}else{
			return this.handleFail(err, 10009)
		}
	},
	handleSuc(data=''){
		return {
			code: 0,
			data,
			message: ''
		}
	},
	handleFail(message="", code=10001){
		return {
			code,
			data: '' ,
			message
		}
	},
	//生成随机数
	createNonceStr(){
		return Math.random().toString(36).substr(2, 15)
	},
	//生成时间戳
	createTimeStamp(){
		return parseInt(new Date().getTime() / 1000) + ''
	},
	//Object 转换成json并排序
	raw(args){
		let keys = Object.keys(args).sort()
		let obj = {}
		keys.forEach(key => {
			obj[key] = args[key]
		})
		let val = ''
		for(let k in obj){
			val += '&' + k + '=' + obj[k]
		}
		return val.substr(1)
	}
}
