// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  try {
  	return await db.collection('questionnaires').doc(event._id).update({
  		data:{
  			quesList: event.quesList,
  			count: _.inc(1)
  		},
  		success: res => { return res },
  		fail: res => { return res }
  	})
  } catch (e) {
  	console.error(e)
  	return e
  }
}