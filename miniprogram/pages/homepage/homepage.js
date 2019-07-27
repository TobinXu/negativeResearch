const app = getApp()
var WxSearch = require('../../component/wxSearch/wxSearch.js')

Page({
   data: {
    questionnaires: [], //问卷列表
    drawerShow: false, //是否隐藏抽屉层
    id: 0, //用户点击的问卷id
    skip: 1, //第几次获取问卷（一次获取10份）
    hasMore: true, //还有没有更多问卷
    inputVal: '', //搜索问卷
    moreLoadingHidden: true, //是否显示加载更多
    searchLoadingHidden: true, //是否显示加载正在搜索
    // 搜索栏的相关数据
    wxSearchData: {
      value: "",
      onSearch: false
    },
    ques_transcript: []
  },

  onLoad: function(options) {
    this.initWxSearch()
  },

  onShow: function() {
    this.getQues()
  },

  /**
   * 获取问卷
   */
  getQues: function() {
    if (this.data.wxSearchData.onSearch) {
      return 
    }
    // 从数据库获取问卷
    const db = wx.cloud.database()
    //查找questionnaires集合条件为openid=用户的openid，并按qid进行降序排列，获取10个
    db.collection('questionnaires').orderBy('qid', 'desc').where({
      _openid: app.globalData.userInfo.openid
    }).limit(10).get({
      success: res => {
        this.setData({
          questionnaires: res.data,
          moreLoadingHidden: false
        })
        app.globalData.quesList = res.data
        if (res.data.length < 10) {
          this.setData({hasMore:false})
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  
  /**
   * 初始化的时候渲染wxSearchdata
   */
  initWxSearch: function() {
    var that = this
    // 热门搜索
    WxSearch.init(that, 43, ['大学生情况', '外卖情况', '大学生恋爱', '市场调查', '电脑']);
    // 关键字
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },

  /**
   * 用户点击搜索
   */
  wxSearchFn: function(e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    this.setData({
      searchLoadingHidden: false,
      ques_transcript: this.data.questionnaires
    })
    console.log(this.data)
    const db = wx.cloud.database()
    db.collection("questionnaires").where({
      _openid: app.globalData.userInfo.openid,
      title: db.RegExp({
        regexp: this.data.wxSearchData.value, //从搜索栏中获取的value作为规则进行匹配。
        options: 'i', //大小写不区分
      })
    }).get({
      complete: res => {
        console.log("搜索结果如下:", res)
        this.setData({
          searchLoadingHidden: true,
          questionnaires: res.data,
          ['wxSearchData.onSearch']: true
        })
        app.globalData.quesList = this.data.questionnaires
      }
    })

  },

  /**
   * 搜索后点击返回
   */
  getback: function() {
    app.globalData.quesList = this.data.ques_transcript
    this.setData({
      ['wxSearchData.onSearch']: false,
      questionnaires: this.data.ques_transcript,
      ['wxSearchData.value']: "",
      inputShowed: false
    })
  },

  /**
   * 用户输入搜索内容
   */
  wxSearchInput: function(e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  /**
   * 搜索栏得到焦点
   */
  wxSearchFocus: function(e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  /**
   * 搜索栏失去焦点
   */
  wxSearchBlur: function(e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  /**
   * 点击搜索栏的关键词
   */
  wxSearchKeyTap: function(e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  /**
   * 删除关键词
   */
  wxSearchDeleteKey: function(e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  /**
   * 删除所有关键词
   */
  wxSearchDeleteAll: function(e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  /**
   * 用户点击搜索栏
   */
  wxSearchTap: function(e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

 /**
   * 显示输入框
   */
  showInput: function(e) {
    this.setData({
      inputShowed: true
    })
    // let query = wx.createSelectorQuery()
    // let input_node = query.select('.weui-search-bar__input')
    // console.log(input_node)
    // input_node.focus()
    this.wxSearchFocus(e)
  },
    /**
   * 隐藏输入框
   */
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  /**
   * 清楚输入框
   */
  clearInput: function() {
    console.log('clean')
    this.setData({
      ['wxSearchData.value']: ''
    });
  },

  /**
   * 输入双向绑定
   */
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },


  /**
   * 用户点击的问卷
   */
  onTapQues: function(e) {
    console.log(e)
    const id = e.currentTarget.id
    //这里记录用户点击的问卷id等信息
    this.setData({
      drawerShow: true,
      id: id,
    })
    app.globalData.ques_index = this.data.id
  },

  /**
   * 用户点击蒙版,关闭抽屉层
   */
  onClose() {
    this.setData({
      drawerShow: false
    });
  },

  /**
   * 发布问卷
   */
  release: function() {
    const db = wx.cloud.database()
    const ques = this.data.questionnaires
    db.collection('questionnaires').doc(ques[this.data.id]._id).update({
      data: {
        status: 1
      },
      success: res => {
        ques[this.data.id].status = 1
        this.setData({
          questionnaires: ques
        })
        wx.showModal({
          title: '系统提示',
          content: '发布成功，是否立即分享',
          success: res => {
            if (res.cancel) {
            } else {
              wx.navigateTo({
                url: './share/share',
              })
            }
          }
        })
      }
    })
  },

  /**
   * 暂停问卷
   */
  pause: function() {
    wx.showModal({
      title: '系统提示',
      content: '暂停后将无法填写问卷，确认暂停？',
      success: res => {
        if (res.cancel) {} else {
          const db = wx.cloud.database()
          const ques = this.data.questionnaires
          db.collection('questionnaires').doc(ques[this.data.id]._id).update({
            data: {
              status: 0
            },
            success: res => {
              ques[this.data.id].status = 0
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
  onEdit: function() {
    this.setData({
      drawerShow: false,
      searchLoadingHidden: false
    })
    wx.navigateTo({
      url: './editques/editques',
      complete: () => {
        this.setData({
          searchLoadingHidden: true
        })
      }
    })
  },

  /**
   * 点击加载更多
   */
  getMoreQues: function() {
    this.setData({
      moreLoadingHidden: true
    })
    const skip = this.data.skip
    const db = wx.cloud.database()
    db.collection('questionnaires').orderBy('qid', 'desc').where({
      _openid: app.globalData.userInfo._openid
    }).limit(10).skip(10 * skip).get({
      success: res => {
        this.setData({
          skip: skip + 1,
          questionnaires: this.data.questionnaires.concat(res.data),
          moreLoadingHidden: false
        })
        if (this.data.questionnaires.length < 10) {
          this.setData({
            hasMore: false
          })
        }
      },
      fail: console.error
    })
  },

  /**
   * 点击分享
   */
  share: function() {
    var ques = this.data.questionnaires
    let id = this.data.id
    // 如果 问卷没发布  出现弹窗
    if (ques[id].status == 0) {
      wx.showModal({
        title: '系统提示',
        content: '此问卷还没发布，确认发布吗',
        success: res => {
          if (res.cancel) {
            // 点击取消
          } else {
            // 点击确认
            const db = wx.cloud.database()
            db.collection('questionnaires').doc(ques[id]._id).update({
              data: {
                status: 1
              },
              success: res => {
                ques[id].status = 1
                this.setData({
                  questionnaires: ques
                })
                wx.navigateTo({
                  url: './share/share',
                })
              },
              fail: console.error
            })

          }
        }
      })
    } else {
      wx.navigateTo({
        url: './share/share',
      })
    }
  },

  /**
   * 结果
   */
  result: function () {
    wx.navigateTo({
      url: '../resultChart/resultChart',
    })
  },

  /**
   * 复制问卷
   */
  copyQues: function(e) {
    const id = this.data.id
    var ques = this.data.questionnaires
    const db = wx.cloud.database()
    db.collection("questionnaires").add({
      data:{
        qid: db.serverDate(),
        title:ques[id].title + "[复制]" ,
        status: ques[id].status,
        count: 0,
        desc: ques[id].desc
      }
    }).then(res =>{
        wx.showModal({
          title: '系统提示',
          content: '复制问卷成功',
          showCancel: false,
          success: res => {
            this.setData({
              drawerShow: false
            })
          }
        })
      })
       this.getQues()
  },

  /**
   * 删除问卷
   */
  removeQues: function(e) {
    const id = this.data.id
    var ques = this.data.questionnaires
    const db = wx.cloud.database()
    db.collection("questionnaires").doc(ques[id]._id).remove()
      .then(() => {
        wx.showModal({
          title: '系统提示',
          content: '删除问卷成功',
          showCancel: false,
          success: res => {
            this.setData({
              drawerShow: false
            })
          }
        })
      })
       this.getQues()
  }
})