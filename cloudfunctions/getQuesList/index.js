// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('questionnaires')
      .orderBy('qid','asc')
      .get({
        success: function (res) {
          return res;
          console.log('问卷列表：',res)
        }
      })
  } catch(e){
    console.error(e)
  }
}