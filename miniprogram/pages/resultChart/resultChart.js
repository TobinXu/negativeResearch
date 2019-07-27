var wxCharts = require('../../utils/wxcharts.js'); //引入wxChart文件
var invert_aglor = require('../../utils/nega_to_posi');
var app = getApp();
var lineChart = null;
 // confine the optional upper limit to 6
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ques: {}, //问卷
    titles: '', //问卷的题目相关信息
    quesType: 0, //（整数） 问卷类型  1为负问卷  0为传统问卷
    content: ['', '以下哪个不是您要选的——'], //问卷类型对应的开头内容
    loading: false,
    result: [], //保存的结果  二维字符串数组  选择题：数字代表第几个选项（单选多选都是这样）
    name_list: ['A', 'B', 'C', 'D', 'E', 'F']
  },

  touchstart(e) {
    lineChart.scrollStart(e);
  },
  touchmove(e) {
    lineChart.scroll(e);
  },
  touchend(e) {
    lineChart.scrollEnd(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      ques: app.globalData.quesList[app.globalData.ques_index]
    })
  },

 changeType: function(e) {
    if (e.currentTarget.dataset.id === '1') {
      this.setData({
        quesType: 1
      })
    } else this.setData({
      quesType: 0
    })
  },
  
  onShow: function() {
    let ques = this.data.ques.quesList
    for (let i = 0 ; i < ques.length; i++) {
      ques[i].np_result = invert_aglor(ques[i].nega_result.length, ques[i].nega_result, ques[i].nega_fill)
    }
    this.makeCharts()
    // for(let i = 0; i < 4; i++) {
    //   for (let j = 0; j < ques[i].np_result.length; j++) {
    //     console.log(i+1 +'.', j+1 + '=',(ques[i].posi_result[j] - ques[i].np_result[j]) / ques[i].posi_result[j])
    //   }
    // }
  },

  /**
   * 绘制图表【主要修改这里的数据】
   */
  makeCharts() {
    var windowWidth = '',
      windowHeight = ''; //定义宽高
    try {
      var res = wx.getSystemInfoSync(); //试图获取屏幕宽高数据
      windowWidth = res.windowWidth / 750 * 690; //以设计图750为主进行比例算换  * rpx / 750   750 * 690
      windowHeight = res.windowWidth / 750 * 550 //以设计图750为主进行比例算换
    } catch (e) {
      console.error('getSystemInfoSync failed!'); //如果获取失败
    }
    let ques = this.data.ques.quesList
    let graph_height = 0
    for (let i = 0; i < ques.length; i++) {
      console.log(ques[i])
        // 图像数据
        let graph_data = []
        graph_height = ques[i].posi_result[i]
        for (let j = 0; j < ques[i].options.length; j++) {
          let item = {}, posi = ques[i].posi_result[j] || 0, np = ques[i].np_result[j] || 0
          item.name = this.data.name_list[j]
          item.data = [posi, np]
          let max = Math.max(posi, np)
          if (max > graph_height) graph_height = max
          item.format = function(val) { return val }
          graph_data.push(item)
        }
        if (graph_height === 0) graph_height++
        lineChart = new wxCharts({ //定义一个wxCharts图表实例
          canvasId: 'lineCanvas' + i, //输入wxml中canvas的id
          type: 'column', //图标展示的类型有:'line','pie','column','area','ring','radar'
          categories: ['正问卷', '负问卷'], //模拟的x轴横坐标参数
          animation: true, //是否开启动画
          series: graph_data,
          xAxis: { //是否隐藏x轴分割线
            disableGrid: true,
          },
          yAxis: { //y轴数据
            title: '数值', //标题
            format: function(val) { //返回数值
              // if (val > 0)
                return val
            },
            min: 0, //最小值
            max: graph_height, //最大值
            gridColor: '#D8D8D8',
          },
          width: windowWidth, //图表展示内容宽度
          height: windowHeight, //图表展示内容高度
          dataLabel: true, //是否在图表上直接显示数据
          dataPointShape: true, //是否在图标上显示数据点标志
          enableScroll: true,
          extra: {
            column: {
              width: 40 //柱的宽度为40
            }
          },
        });
    }
  }
})
