// pages/homepage/editques/addtitle/addtitleDetail/addtitleDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
   data: {
    ques: {}
  },

  onLoad: function(options) {
    this.setData({ ques: app.globalData.quesList[app.globalData.ques_index].quesList[options.index]})
  },
  /**
   * 添加选项
   */
   addOptions: function() {
    if (this.data.ques.options.length > 5) {
     wx.showToast({
      title: '选项数量不能超过6',
      duration: 2000,
      mask: true,
      icon: 'none',  
    })
     return
   }
   this.data.ques.options.push({content: '', selected: false})
   this.setData({
    'ques.options': this.data.ques.options
  })
 },

  /**
   * 输入标题
   */
   onInputTitle: function(e) {
    this.setData({
      'ques.ques': e.detail.value
    })
  },

  /**
   * 输入内容
   */
   onInputContent: function(e) {
    const id = e.currentTarget.id
    this.setData({
      ['ques.options['+id+'].content']: e.detail.value
    })
  },

  /**
   * 删除选项
   */
   removeOptions: function(e) {
    if(this.data.ques.options.length < 3) {
      wx.showToast({
        title: '选项数量不能少于1',
        duration: 2000,
        mask: true,
        icon: 'none', 
      })
      return 
    }
    this.data.ques.options.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      'ques.options': this.data.ques.options
    })
  },

  /**
   * 是否为必答题
   */
   handleChange: function (e) {
    const checked = e.detail.value
    this.setData({
      'ques.necessity': checked ? 1 : 0
    })
  },

  /**
   * 完成编辑选题
   */
   submit: function() {
    if(!this.checkValid()) {
      wx.showToast({
       title: '请完成问卷题目',
       duration: 2000,
       // mask: true,
       icon: 'none', 
     })
      return
    }
    const db = wx.cloud.database()
    db.collection('questionnaires').doc(app.globalData.quesList[app.globalData.ques_index]._id).update({
      data: {
        quesList: app.globalData.quesList[app.globalData.ques_index].quesList
      },
      success: res => {
        wx.navigateBack({})
      }
    })
  },
  checkValid: function () {
    let options = this.data.ques.options
    for (let i = 0; i < options.length; i++) {
      if (options[i].content === '') {
        return false
      }
    }
    return true
  }
})