// pages/homepage/editques/addtitle/addtitleDetail/addtitleDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
   data: {
    ques: {
      ques: '',
      necessity: 1,
      options: [
      {
        content: '',
        selected: false
      },
      {
        content: '',
        selected: false
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    // this.setData({ ques: app.globalData.quesList[app.globalData.ques_index].quesList[options.index]})
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
   * 添加题目完成
   */
   finishOptions: function() {
    if (!this.checkValid()) {
      wx.showToast({
       title: '请完成问卷题目',
       duration: 2000,
       // mask: true,
       icon: 'none', 
     })
      return 
    }
    const db =wx.cloud.database()
    const _ = db.command
      // 初始化数据保存列表
      let po = [], ng = []
      for (let i = 0; i < this.data.ques.options.length; i++) {
        po.push(0)
        ng.push(0)
      }
      let new_ques = { 
        tid: app.globalData.quesList[app.globalData.ques_index].quesList.length + 1,
        ques: this.data.ques.ques,
        options: this.data.ques.options,
        necessity: this.data.ques.necessity,
        // typeId: this.data.typeId,
        posi_result: po,
        nega_result: ng,
        posi_fill: 0,
        nega_fill: 0
      }
      db.collection('questionnaires').doc(app.globalData.quesList[app.globalData.ques_index]._id).update({
        data: {
          quesList: _.push(new_ques)
        },
        success: res => {
          app.globalData.quesList[app.globalData.ques_index].quesList.push(new_ques)
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    checkValid: function () {
      let ques = this.data.ques
      if (!ques.ques) {
        return false
      }
      for (let i = 0; i < ques.options.length; i++) {
        if (ques.options[i].content === '') {
          return false
        }
      }
      return true
    }
  })