// pages/homepage/share/share.js
let app = getApp()
Page({
 data: {
    ques: {},//显示问卷
    quesType: null,//（整数） 问卷类型  1为负问卷  0为传统问卷
    content: ['','以下哪个不是您要选的——'],//问卷类型对应的开头内容
    result: [],//保存的结果  二维字符串数组  选择题：数字代表第几个选项（单选多选都是这样）
  },
  onLoad: function (options) {
    // console.log(options)
    // this.chooseType()
    let db = wx.cloud.database()
    let _this = this
    db.collection('questionnaires').where({
      _id: options._id
    }).get({
      success: function (res) {
        console.log(res.data[0])
        _this.setData({
          ques: res.data[0]
        })
      }
    })
  },

  /**
   * 弹窗选择问卷类型
   */
   chooseType: function () {
    wx.showModal({
      title: '系统提示',
      content: '你想选择哪类问卷填写？',
      cancelText: "负问卷",
      cancelColor: 'green',
      confirmText: "传统问卷",
      confirmColor: 'black',
      success: res => {
        if (res.cancel) {
          this.setData({
            quesType: 1
          })
        } else {
          this.setData({
            quesType: 0
          })
        }
      }
    })
  },

setNega: function() {
  this.setData({quesType:1})
},

setPosi: function() {
  this.setData({quesType: 0})
},
  /**
   * 选中某个单选题
   */
   onSelectedtitle: function (e) {
    console.log(e)
    const index = e.currentTarget.dataset.index // 题目的id
    const aid = e.target.dataset.aid // 题目答案的id
    // 判断是否选择相同的选项
    if (this.data.result[index] === aid) {
      this.setData({
        ['result['+index+']']: -1 
      })
      return 
    }
    if(aid == null) return
      let arr = this.data.result
    arr[index] = aid
    this.setData({
      result: arr
    })
  },

  /**
   * 用户输入文本时
   */
   onTextChange: function (e) {
    var arr = this.data.result
    const tid = e.currentTarget.id
    arr[tid] = [e.detail]
    // console.log(arr)
    this.setData({
      result: arr
    })
  },
  /**
   * 完成提交
   */
   submit: function () {
    if (this.data.ques === 0) {
      wx.showModal({
        title: '系统提示',
        content: '该问卷已暂停',
        showCancel: false,
        confirmColor: 'red',
        success: res => {},
      })
      return
    }
    const result = this.data.result
    const ques = this.data.ques.quesList
    for (var i = 0; i <ques.length;i++){
      if (result[i] < 0 || result[i] === undefined && ques[i].necessity === 1) {
       wx.showModal({
        title: '系统提示',
        content: '还有选项未完成',
        showCancel: false,
        confirmColor: 'red',
        success: res => { },
      })
       return
     } else {
     }
   }
    wx.showLoading({
      title: '提交中',
    })
    // 添加问卷调查数据
    this.setResultData()
    // let count = this.data.ques.count + 1
    wx.cloud.callFunction({
      name: 'update_ques',
      data: {
        _id: this.data.ques._id,
        quesList: this.data.ques.quesList,
        // count: count
      },
      success: res => {
        // console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          // mask: true,
          icon: 'success',
        })
        this.setData({
          result: []
        })
      }
    })
  },

  setResultData: function () {
    if (!this.data.result.length) {
      return
    }
    let ques = this.data.ques.quesList
    for (let i = 0; i < ques.length; i++) {
      // 选出有确定值的题目
      if (this.data.result[i] > -1) {
        if (this.data.quesType === 0) {
          ques[i].posi_result[this.data.result[i]]++
          ques[i].posi_fill++
        } else {
          ques[i].nega_result[this.data.result[i]]++
          ques[i].nega_fill++
        }
      }
    }
    this.setData({
      'ques.quesList': ques
    })
  },
})
