//pages/homepage/editques/editques/editques.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
   data: {
    index: -1,
    ques: {},//问卷列表
    onEditTitle: false//是否显示标题的编辑框框
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.setData({
      ques: app.globalData.quesList[app.globalData.ques_index]
    })
  },
  onShow: function () {
    this.setData({
     ques: app.globalData.quesList[app.globalData.ques_index]
   })
    this.setData({
      index: -1
    })
  },
  /**
   * 点击出现编辑选项
   */
   onEditTitle: function () {
    const ques = this.data.ques.quesList
    for (var index of ques) {
      if (index.onChange) {
        index.onChange = false
        break
      }
    }
    this.setData({
      onEditTitle: !this.data.onEditTitle,
      'ques.quesList': ques
    })
  },

  /**
   * 点击出现改变题目的四个选项
   */
   onChangetitle: function (e) {
    let index = e.currentTarget.dataset.index
    if (this.data.index !== index)
      this.setData({
        index: index
      })
    else this.setData({
      index: -1
    })
  },

  /**
   * 点击标题的编辑选项跳转至编辑页面
   */
   editTitle: function () {
     this.setData({
       index: -1
     })
     wx.navigateTo({
      url: './editTitle/editTitle?index='+this.data.index,
    })
   },

  /**
   * 点击题目的编辑选项跳转至编辑页面
   */
   changetitle: function (e) {
     wx.navigateTo({
      url: './edittitles/edittitles?index='+this.data.index
    })
   },

  /**
   * 点击题目的上移选项
   */
   uptitle: function () {
    let index = this.data.index
    let ques = this.data.ques.quesList
    ques.splice(index - 1, 0, ques[index])
    ques.splice(index + 1, 1)
    this.setData({ 'ques.quesList': ques,
      index: -1
    })
    this.submit()
  },

  /**
   * 点击题目的下移选项
   */
   downtitle: function (e) {
    let index = this.data.index
    let ques = this.data.ques.quesList
    ques.splice(index + 2, 0, ques[index])
    ques.splice(index, 1)
    this.setData({ 'ques.quesList': ques,
      index: -1
    })
    this.submit()
  },

  /**
   * 点击题目的删除选项
   */
   deletetitle: function (e) {
    let _this = this
    wx.showModal({
      title: '系统提示',
      content: '是否确认删除此题',
      success: res => {
        if (res.cancel) {
        }else {
          let index = _this.data.index
          let ques = _this.data.ques.quesList
          ques.splice(index, 1)
          _this.setData({ 'ques.quesList': ques,
           index: -1
         })
          _this.submit() 
        }
      }
    })
  },

  /**
   * 添加题目
   */
   onAddtitle: function () {
     wx.navigateTo({
      url: './addtitle/addtitleDetail/addtitleDetail',
    })
   },
   submit: function () {
    const db = wx.cloud.database()
    db.collection('questionnaires').doc(app.globalData.quesList[app.globalData.ques_index]._id).update({
      data: {
        quesList: app.globalData.quesList[app.globalData.ques_index].quesList
      }
    })
  }
})