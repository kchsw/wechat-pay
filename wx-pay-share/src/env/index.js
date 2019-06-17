const envList = {
	dev: {
		baseUrl: ''
	},
	test: {
		baseUrl: ''
	},
	prod: {	
		domain: 'http://yuming.com'
		baseUrl: ''
	}
}

// let currenEnv = 'prod'
let currenEnv

let params = {
	"dev-m.yuming.com": 'dev',
	"test-m.yuming.com": 'test',
	"m.yuming.com": 'prod'
}

currenEnv = params[locataion.hostname]

export default envList[currenEnv]