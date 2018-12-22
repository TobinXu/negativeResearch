// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('titles').orderBy('tid','asc')
      .where({
        qid: event.qid
      })
      .get({
        success: function (res) {
          return res;
          console.log('问卷题目列表：', res)
        }
      })
  } catch (e) {
    console.error(e)
  }
}