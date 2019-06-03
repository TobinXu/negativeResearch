// pages/homepage/share/share.js
let app = getApp()
Page({
   data: {
    ques: {},//显示问卷
    quesType: 0,//（整数） 问卷类型  1为负问卷  0为传统问卷
    content: ['','以下哪个不是您要选的——'],//问卷类型对应的开头内容
    loading: false,
    result: [],//保存的结果  二维字符串数组  选择题：数字代表第几个选项（单选多选都是这样）
   },
  onLoad: function (options) {
    // this.chooseType()
    this.setData({
      ques: app.globalData.quesList[app.globalData.ques_index],
    })
    // console.log(this.data)
    if (this.data.ques === 0) {
      wx.showModal({
        title: '系统提示',
        content: '该问卷已暂停',
        showCancel: false,
        confirmColor: 'red',
        success: res => { },
      })
    }
  },
  
  changeType: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.id === '1') {
      this.setData({
        quesType: 1
      })
    } else this.setData({
      quesType: 0
    })
  },

  /**
   * 选中某个单选题
   */
  onSelectedtitle: function (e) {
    // console.log(e)
    const index = e.currentTarget.dataset.index // 题目的id
    const aid = e.target.dataset.aid // 题目答案的id
    if(aid == null) return
    let arr = this.data.result
    arr[index] = aid
    let ques = this.data.ques.quesList
    // console.log(ques)
    for (let i = 0; i < ques[index].options.length; i++) {
      if (ques[index].options[i].selected) {
        ques[index].options[i].selected = false
      }
    }
    ques[index].options[aid].selected = true
    this.setData({
      'ques.quesList': ques,
      result: arr
    })
  },
  test: function() {
     wx.navigateTo({
      url: '../../fill/fill?_id='+this.data.ques._id
    })
   },
  onShareAppMessage: function(res) {
    return {
      path:'/pages/fill/fill?_id='+this.data.ques._id
    }
  }
})
