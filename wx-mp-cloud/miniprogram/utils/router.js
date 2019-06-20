const routerPath = {
	'index': '/pages/index/index',
	'pay': '/pages/pay/pay',
	'activity': '/pages/activity/activity'
}

module.exports = {
	push(path, option = {}){
		if(typeof path == 'string'){
			option.path = path
		}else{
			option = path
		}
		let url = routerPath[option.path]
		let { query={}, openType, duration } = option
		let params = this.parse(query)
		if(params){
			url += '?' + params
		}
		duration ? setTimeout(() => {
			this.to(openType, url)
		}, duration) : this.to(openType, url)
	},
	to(openType, url){
		let obj = { url }
		if(openType == 'redirect'){
			wx.redirectTo(obj)
		}else if(openType == 'reLaunch'){
			wx.reLaunch(obj)
		}else if (openType == 'back'){
			wx.navigateBack({
				delta: 1
			})
		}else{
			wx.navigateTo(obj)
		}
	},
	parse(data){
		let arr = []
		for(let key in data){
			arr.push(key + '=' + data[key])
		}
		return arr.join('&')
	}
}