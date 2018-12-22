// pages/homepage/editques/editques.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qid: null,
    ques: null,
    onEditTitle: true,
    titles: null,
    onchangetitle: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      qid: options.qid
    })
    this.selectedQues()
    this.selectedQuesTitles()
  },

  /**
   * 点击出现编辑选项
   */
  onEditTitle: function() {
    const titles = this.data.titles
    for(var index of titles){
      if(index.onChange){
        index.onChange = false
        break
      }
    }
    this.setData({
      onEditTitle: !this.data.onEditTitle,
      titles:titles
    })
  },

  /**
   * 点击出现改变题目的四个选项
   */
  onChangetitle: function(e) {
    const tid = e.currentTarget.dataset.tid
    const titles = this.data.titles
    if (this.data.onEditTitle) {
      this.setData({
        onEditTitle: false
      })
      titles[tid - 1].onChange = !titles[tid - 1].onChange
      this.setData({
        titles: titles
      })
      return
    }else for(var index of titles){
      if (index.onChange) {
        if (index.tid == tid) {
          titles[tid - 1].onChange = !titles[tid - 1].onChange
          this.setData({
            titles: titles
          })
          return
        } else {
          index.onChange = false
          titles[tid - 1].onChange = !titles[tid - 1].onChange
          this.setData({
            titles: titles
          })
          return
        }
      } 
    }
    titles[tid - 1].onChange = !titles[tid - 1].onChange
    this.setData({
      titles: titles
    })
    console.log(titles)
  },

  /**
   * 点击标题的编辑选项跳转至编辑页面
   */
  editTitle: function() {
    wx.navigateTo({
      url: './editTitle/editTitle?qid=' + this.data.qid,
    })
  },

  /**
   * 点击题目的编辑选项跳转至编辑页面
   */
  changetitle: function() {
    wx.navigateTo({
      url: './edittitles/edittitles?qid=' + this.data.qid,
    })
  },

  /**
   * 点击题目的上移选项
   */
  uptitle: function (e) {
    const tid = e.currentTarget.dataset.tid
    if(tid == 1){
      wx.showModal({
        content: '第一题不能上移了',
        showCancel: false,
        confirmText: "好的"
      })
      return
    }
    const db = wx.cloud.database()
    const _id_up = this.data.titles[tid-1]._id
    const _id_down = this.data.titles[tid-2]._id
    db.collection('titles').doc(_id_up).update({
      data:{
        tid: (tid - 1)
      },
      success: res => {
        console.log("上移成功")
      }
    })
    db.collection('titles').doc(_id_down).update({
      data:{
        tid: tid
      },
      success: res => {
        const titles = this.data.titles
        titles[tid - 1].tid = tid - 1
        titles[tid - 2].tid = tid
        const t = titles[tid - 1]
        titles[tid - 1] = titles[tid - 2]
        titles[tid - 2] = t
        this.setData({
          titles: titles
        })
      }
    })
  },

  /**
   * 点击题目的下移选项
   */
  downtitle: function(e) {
    const tid = e.currentTarget.dataset.tid
    const titles = this.data.titles
    if (tid == titles.length) {
      wx.showModal({
        content: '最后一题不能下移了',
        showCancel: false,
        confirmText: "好的"
      })
      return
    }
    const db = wx.cloud.database()
    const _id_down = titles[tid - 1]._id
    const _id_up = titles[tid]._id
    db.collection('titles').doc(_id_down).update({
      data: {
        tid: (tid - 1)
      },
      success: res => {
        console.log("下移成功")
      }
    })
    db.collection('titles').doc(_id_up).update({
      data: {
        tid: tid
      },
      success: res => {
        titles[tid - 1].tid = tid + 1
        titles[tid].tid = tid
        const t = titles[tid - 1]
        titles[tid - 1] = titles[tid]
        titles[tid] = t
        this.setData({
          titles: titles
        })
      }
    })
  },

  /**
   * 点击题目的删除选项
   */
  deletetitle: function(e) {
    wx.showModal({
      title: '系统提示',
      content: '是否确认删除此题',
      success: res => {
        if(res.cancel){
        }else{
          const db = wx.cloud.database()
          const titles = this.data.titles
          const tid = e.currentTarget.dataset.tid
          const _id = titles[tid - 1]._id
          db.collection('titles').doc(_id).remove()
            .then(res => {
              console.log('删除成功:', res)
              titles.splice(tid-1,1)
              for (var j = tid; j <= titles.length; j++){
                titles[j - 1].tid = j
              }
              console.log(titles)
              this.setData({
                titles: titles
              })
            })
            .catch(console.log)
          // 改变数据库中删除项后面元素的tid
          for (var i = tid - 1; i < titles.length; i++){
            const __id = titles[i]._id
            db.collection('titles').doc(__id).update({
              data:{
                tid: i
              }
            }).then(console.log)
            .catch(console.error)
          }
        }
      }
    })
  },

  /**
   * 添加题目
   */
  onAddtitle: function(){
    wx.navigateTo({
      url: './addtitle/addtitle',
    })
  },

  /**
   * 获取问卷
   */
  selectedQues: function() {
    const db = wx.cloud.database()
    db.collection('questionnaires').where({
      qid: Number(this.data.qid)
    }).get({
      success: res => {
        if (res.data[0].desc == null){
          res.data[0].desc = "添加问卷说明"
        }
        this.setData({
          ques: res.data[0]
        })
        console.log("第" + this.data.qid + "套问卷为：", this.data.ques)
      },
      fail: console.error
    })
  },

  /**
   * 获取问卷题目内容
   */
  selectedQuesTitles: function() {
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      name: "getQuesTitles",
      data:{
        qid: Number(this.data.qid)
      },
      success: res => {
        console.log("第" + this.data.qid + "套问卷题目内容为：",res.result.data)
        this.setData({
          titles: res.result.data
        })
      },
      fail: console.error
    })
  },

  /**
   * 改变选项
   */
  radioChange: function (e) {
    const value = e.detail.value
    console.log(value)
    // this.setData({ radioStr: str });
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