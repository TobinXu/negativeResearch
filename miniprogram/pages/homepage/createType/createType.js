// pages/homepage/createType/createType.js
const getDateDiff = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTitle: '',//用户输入的标题
    inputDesc: '',//用户输入的说明
  },

  /**
   * 生命周期函数--监听页面加载 获取qcount的初始值
   */
  onLoad: function(options) {
   
  },

  /**
   * 用户输入标题时
   */
  onInputTitle: function(e) {
    const value = e.detail.value
    this.setData({
      inputTitle: value
    })
  },

   /**
   * 用户输入说明时
   */
  onInputDesc: function(e) {
    const value = e.detail.value
    this.setData({
      inputDesc: value
    })
  },

  /**
   * 创建问卷
   */
  submit: function() {
    if (!this.data.inputTitle) {
      wx.showToast({
        icon: 'none',
        title: '标题不能为空'
      })
      return
    }

    // 调用数据库
    const db = wx.cloud.database()
    db.collection('questionnaires').add({
      data: {
        title: this.data.inputTitle,
        desc: this.data.inputDesc,
        qid: db.serverDate(),
        status: 0, // 问卷状态 0 未发布 1 已发布 
        count: 0, // 问卷填写数量
        quesList: [] // 问卷题目保存列表
      },
      success: res => {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: console.error
    })
  }
})