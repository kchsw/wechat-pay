export default{
	getUrlParam(key){
		let reg = new RegExp(`(^|&)${name}=([^&]*)`)
		let r = window.location.search.substr(1).match(reg)
		if(r != null) return decodeURIComponent(r[2])
	},
	initShareInfo(wx){
		let shareInfo = {
			title: '支付专享', // 分享标题
			desc: '没有爱请离开', // 分享描述
        	link: 'http://m.imooc.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        	imgUrl: '', // 分享图标
		}

		wx.onMenuShareTimeline(shareInfo)
		wx.onMenuShareAppMessage(shareInfo)
		// wx.onMenuShareQQ(shareInfo)
		// wx.onMenuShareQZone(shareInfo)

		// wx.updateAppMessageShareData(shareInfo)
		// wx.updateTimelineShareData(shareInfo)
	}
}