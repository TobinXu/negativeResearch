//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      userInfo: {
        _openid: 'oOPFo5FkBbyWlXDML5BYpHt_6uas'//修改为自己的openid
      },//用户信息
      quesList: [],// 问卷列表
      ques_index: -1,
      ques: [],// 某个问卷的标题信息
      titles: [],// 某个问卷中的题目列表
      searchResult:[]//用户搜索结果
    }
  }
})
