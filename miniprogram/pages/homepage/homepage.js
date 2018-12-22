// pages/welcome/welcome.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionnaires: null,
    hideDrawer: true,
    qid:null,
    skip: 1,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQues()
  },

  /**
   * 获取问卷
   */
  getQues: function () {
    const db = wx.cloud.database()
    db.collection('questionnaires').orderBy('qid', 'desc').where({
      _openid: 'oOPFo5FkBbyWlXDML5BYpHt_6uas'
    }).limit(10).get({
      success: res => {
        console.log(res.data)
        this.setData({
          questionnaires: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 点击问卷
   */
  onTapQues: function (e) {
    const qid = e.currentTarget.dataset.qid
    console.log("此问卷的qid为：", qid)
    this.setData({
      hideDrawer: false,
      qid: qid
    })
  },

  /**
   * 发布问卷
   */
  release: function () {
    const db = wx.cloud.database()
    const ques = this.data.questionnaires
    const _id = ques[this.data.qid - 1]._id
    db.collection('questionnaires').doc(_id).update({
      data:{
        status: 1
      },
      success: res =>{
        console.log(res)
        ques[this.data.qid - 1].status = 1
        this.setData({
          questionnaires: ques
        })
        wx.showModal({
          title: '系统提示',
          content: '发布成功，是否立即分享',
          success: res => {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
              this.setData({
                hideDrawer: true,
              })
            } else {
              //点击确定
              wx.navigateTo({
                url: './share/share',
              })
            }
          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
      }
    })
  },

  /**
   * 暂停问卷
   */
  pause: function () {
    wx.showModal({
      title: '系统提示',
      content: '暂停后将无法填写问卷，确认暂停？',
      success: res => {
        if (res.cancel) {
        } else {
          const db = wx.cloud.database()
          const ques = this.data.questionnaires
          const _id = ques[this.data.qid - 1]._id
          db.collection('questionnaires').doc(_id).update({
            data: {
              status: 0
            },
            success: res => {
              console.log(res)
              ques[this.data.qid - 1].status = 0
              this.setData({
                questionnaires: ques,
              })
            }
          })
        }
      }
    })
  },

  /**
   * 点击编辑
   */
  onEdit:function(){
    this.setData({
      hideDrawer: true
    })
    wx.navigateTo({
      url: './editques/editques?qid=' + this.data.qid,
    })
    
  },

  /**
   * 设置抽屉层状态
   */
  setModalStatus:function(e){
    var status = e.currentTarget.dataset.status
    console.log('status:',status)
    if(status == 0){
      this.setData({
        hideDrawer: 1
      })
    }
  },

  /**
   * 显示输入框
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  /**
   * 隐藏输入框
   */
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  /**
   * 清楚输入框
   */
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  /**
   * 输入双向绑定
   */
  inputTyping: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 搜索
   */
  tapSearch: function (event) {
    if (this.data.inputVal == null || this.data.inputVal.length == 0) {
      return;
    }
    var that = this;
    this.setData({
      loadingHidden: false,
      nullHidden: true,
      lodingInfo: "正在搜索",
      maxlist: app.globalData.maxlist,
    })
    
    console.log(that.data.maxlist)
    var i;
    for (i = 0; i < that.data.maxlist.length; i++) {
      if (this.myIndexOf(that.data.inputVal, that.data.maxlist[i].foodname) == 1) {
        wx.navigateTo({
          url: "/pages/result/result?cid=" + i
        });
        break;
      }
    }
    if (i == that.data.maxlist.length) {
      wx.showToast({
        title: "抱歉哦，亲，找不到该食物",
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },

  /**
   * 点击加载更多
   */
  getMoreQues: function () {
    const skip = this.data.skip
    const db =wx.cloud.database()
    db.collection('questionnaires').limit(10).skip(10*skip).get({
      success: res => {
          console.log("第"+(1+skip*10)+'套问卷到第'+(skip+1)*10+'套问卷为:',res.data)
          this.setData({
            skip: skip + 1,
            questionnaires: this.data.questionnaires.concat(res.data)
        })
        if (res.data.length < 10) {
          this.setData({
            hasMore: false
          })
        }
      },
      fail: console.error
    })

    // if()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQues()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})