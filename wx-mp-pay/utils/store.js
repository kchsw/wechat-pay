const STORAGE_KEY = 'imooc-pay'

module.exports = {
	setItem(key, value, module_name){
		if(module_name){
			let module_name_info = this.getItem(module_name)
			module_name_info[key] = value
			wx.setStorageSync(module_name, module_name_info)
		}else{			
			wx.setStorageSync(key, value)
		}
	},
	getItem(key, module_name){
		if(module_name){
			let val = this.getItem(module_name)
			if(val) return val[key] 
			return ''
		}else{
			return wx.getStorageSync(key)
		}
	},
	clear(key){
		key ? wx.removeStorageSync(key) : wx.clearStorageSync()
	},
	getSystemInfo(){
		return wx.getSystemInfoSync()
	}
}