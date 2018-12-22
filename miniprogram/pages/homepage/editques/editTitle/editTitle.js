// pages/homepage/editTitle/editTitle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTitle: null,
    inputDesc: null,
    qid: null,
    ques: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      qid: options.qid
    })
    const db = wx.cloud.database()
    db.collection('questionnaires').where({
      qid: Number(options.qid)
    }).get({
      success: res => {
        console.log("问卷标题内容：",res.data[0])
        this.setData({
          ques: res.data[0],
          inputTitle: res.data[0].title,
          inputDesc: res.data[0].desc
        })
      }
    })
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
   * 获取云函数getQuesList
   */
  getQues: function() {
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      name: "getQuesList",
      complete: res => {
        console.log('云函数返回数据：', res)
      }
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
   * 确定修改问卷内容
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
    db.collection('questionnaires').doc(this.data.ques._id)
    .update({
      data: {
        title: this.data.inputTitle,
        desc: this.data.inputDesc
      },
      success: res => {
        console.log("问卷修改成功：",res)
        wx.redirectTo({
          url: '../editques?qid=' + this.data.qid,
        })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})