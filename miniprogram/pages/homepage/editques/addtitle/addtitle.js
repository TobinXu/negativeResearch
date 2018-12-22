// pages/homepage/editques/addtitle/addtitle.js
const basic_title = [
  {
    name:"单选题",
    url:"singleChoice.png"
  },
  {
    name:"多选题",
    url:"multipleChoice.png"
  },
  {
    name:"填空题",
    url:"fillInTheBlank.png"
  },
  {
    name:"排序题",
    url:"sort.png"
  },
]
const title_templet = [
  {
    name:"姓名",
    url:"singleChoice.png"
  },
  {
    name:"性别",
    url:"multipleChoice.png"
  },
  {
    name:"手机",
    url:"fillInTheBlank.png"
  },
  {
    name:"日期",
    url:"sort.png"
  },
]
const add_titles = [
  {
    name:"题库选题",
    url:"singleChoice.png"
  },
  {
    name:"图片添题",
    url:"multipleChoice.png"
  },
  {
    name:"文本导入",
    url:"fillInTheBlank.png"
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    basic_title: basic_title,
    title_templet: title_templet,
    add_titles: add_titles
  },

  /**
   * 跳转到添加题目详情页面
   */
  navg: function (e) {
    const type = e.currentTarget.id
    wx.navigateTo({
      url: './addtitleDetail/addtitleDetail?type='+ type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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