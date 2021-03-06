// pages/AllTrainingCourses/AllTrainingCourses.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    resdata: [],
    totalpage: '',
    pageNo: 1,
    listLock: 1,
    pageSize: 20,
    hasMoreData: true,
    status: '',
    jumpid: '',
    statusid:'',
    TrainingCourses: [{
      url: '../../images/block1.png',
      title: "全部课程全部课程全部课程全部",
      des: "All courses",
      id: 1
    }, ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.getData('正在加载数据...');
  },
  // 跳转页面
  gotoOtherpages: function () {
    var that = this;
    if(that.data.statusid == 1){
      wx.navigateTo({
        url: '../AllTrainingCoursesDetail/AllTrainingCoursesDetail?index=' + that.data.jumpid
      });
    }
    if (that.data.statusid == 0 || that.data.statusid == 2){
      wx.navigateTo({
        url: '' 
      });
    }
     
    else{
      wx.navigateTo({
        url: '' 
      });
    }
      
  },

  /*
  获取数据
  */
  getData: function (message) {
    wx.showLoading({
      title: message,
    })
    var that = this;
    that.setData({
      userId: wx.getStorageSync("userId"),

    })
    wx.request({
      url: app.globalData.URL + '/app/trainingclass-list.jspx',
      data: {
        userId: that.data.userId,
        pageNo: that.data.pageNo
      },
      method: 'GET', //方法分GET和POST，根据需要写
      header: { //定死的格式，不用改，照敲就好
        'Content-Type': 'application/json'
      },
      success: function (res) { //这里写调用接口成功之后所运行的函数
        console.log(res.data); //调出来的数据在控制台显示，方便查看
        var e = JSON.parse(res.data.json);
        let arryData = e.trainingclassusers;


        var jumpid = arryData.map((item) => {
          return item.id;
        })
        that.setData({
          jumpid: jumpid
        });

        console.log(e.trainingclassusers);
        var statusid = arryData.map((item) => {
          return item.status;
        })
        that.setData({
          statusid:statusid
        })
        if (statusid == 0) {
          that.setData({
            status: '未开始'
          })
        }
        if (statusid == 1) {
          that.setData({
            status: '已开始'
          })
        }
        if (statusid == 2) {
          that.setData({
            status: '已结束'
          })
        }

        // that.setData({
        //   resdata: e.trainingclassusers,//res.data就是你调出来的所有数据（当然也可以在这里面自定义想要调用的数据），然后把值赋给resdata，之后对resdata进行处理即可，具体见wxml
        //   totalPage: e.totalPage,
        // })
        var contentlistTem = that.data.resdata;
        if (that.data.pageNo == 1) {
          contentlistTem = []
        }
        var resdata = e.trainingclassusers;
        if (that.data.pageNo >= e.totalPage) {
          that.setData({
            resdata: contentlistTem.concat(resdata),
            hasMoreData: false
          })
        } else {
          that.setData({
            resdata: contentlistTem.concat(resdata),
            hasMoreData: true,
            pageNo: that.data.pageNo + 1
          })
        }
      },
      fail: function (res) { //这里写调用接口失败之后所运行的函数
        console.log('.........fail..........');
      },
      complete: function () {
        wx.hideLoading();
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
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
    console.log('下拉');
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.data.pageNo = 1
    this.getData('正在刷新数据')

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getData('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})