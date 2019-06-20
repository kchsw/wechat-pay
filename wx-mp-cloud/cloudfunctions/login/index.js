// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const result = await db.collection('users').where({
     openid: wxContext.OPENID
  }).limit(1).get()
  if(result.data.length == 0){
  	let data = {
  		...event.user,
  		openid: wxContext.OPENID
  	}
  	const userData = await db.collection('users').add({
  		data 
  	})
  	const result = await db.collection('users').where({
	    openid: wxContext.OPENID
	}).limit(1).get()
	return {
		userId: result.data[0]._id
	}
  }else{
  	return {
  		userId: result.data[0]._id
  	}
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}