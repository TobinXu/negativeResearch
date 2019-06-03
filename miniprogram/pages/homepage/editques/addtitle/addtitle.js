// pages/homepage/editques/addtitle/addtitle.js
const basic_title = [
  {
    name: "单选题",
    url: "singleChoice.png"
  },
  {
    name: "多选题",
    url: "multipleChoice.png"
  },
  {
    name: "填空题",
    url: "fillInTheBlank.png"
  },
  {
    name: "排序题",
    url: "sort.png"
  },
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    basic_title: basic_title,//数组  即一个列表  存放名称和图标的路径  用于html中的循环显示
    qid: 0,//问卷id
    _id: ''
  },

  /**
   * 跳转到添加题目详情页面
   */
  navg: function (e) {
    // 0 单选  1 多选  2填空
    console.log(e)
    // 类型名称
    const type = e._relatedInfo.anchorRelatedText
    // 类型名称对应的id
    const typeId = e.currentTarget.id
    wx.navigateTo({
      url: './addtitleDetail/addtitleDetail?type=' + type +'&typeId='+typeId+ '&qid=' + this.data.qid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      qid: options.qid,
      // _id: options._id
    })
  }
})