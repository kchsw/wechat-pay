module.exports = {
	devServer: {
		//设置主机
		host: 'm.imooc.com',
		//设置默认端口
		port: 80,
		//设置代理
		proxy: {
			'/api': {
				//设置比目标API地址
				target: 'http://localhost:3000',
				ws: false,
				changeOrigin: false, //true时 忽略api字段
			}
		}
	}
}