// pages/homePage/homePage.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getRandomPopularMovie:"",
    randomFilmReviewDetails:"",
    filmReviewList:[],
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomPopularMovie()
    this.getReviewList()
  },
  getReviewInfo() {//获取主页随机推荐的热门电影对应的随机的影评数据函数
    let id = this.data.getRandomPopularMovie.id
    let reviewList = this.data.filmReviewList || null
    let items = []
    if (reviewList){
    reviewList.forEach(function (cv) {//筛选出的与收藏数据关联的电影数据
      if (cv.id == id) {
        items.push(cv)
      }
    })
    let item = items[Math.floor(Math.random() * items.length)] || null;
    this.setData({
      randomFilmReviewDetails: item
    })
    }
  },
  getRandomPopularMovie(callback) {
    wx.showLoading({
      title: '随机推荐中...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          let items = result.data.data
          // 随机获取数组中的元素(by stackoverflow)
          let item = items[Math.floor(Math.random() * items.length)];
          if (item){
          this.setData({
            getRandomPopularMovie: item
          })
          }
            callback && callback()
          setTimeout(() => {
           this.getReviewInfo()//电影随机推荐成功后调用对应的随机推荐的影评函数
          }, 500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '热门电影随机数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '电影数据加载失败',
        })
      }
    })
  },
  getReviewList() {//获取特定影评函数
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        let data = result.data
        if (!data.code) {
          let items = data.data
          this.setData({
            filmReviewList:items
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评列表数据加载失败',
          })
        }
      },
      fail: result => {
        wx.showToast({
          icon: 'none',
          title: '影评列表数 据加载失败',
        })
      }
    })
  },
  onTapBackToDetails() {
    let moviesInfo = this.data.getRandomPopularMovie
    wx.navigateTo({
      url: `/pages/filmDetails/filmDetails?id=${moviesInfo.id}&description=${moviesInfo.description}&title=${moviesInfo.title}&image=${moviesInfo.image}`
    })
  },
  onTapToReviewDetails(evt) {//跳转到影评详情页面
    console.log("wqwqwwq点击的影评", evt.currentTarget.id)
    let id
    let review_id
    let reviewArray = this.data.filmReviewList
    reviewArray.forEach(function (cv) {
      if (cv.review_id == evt.currentTarget.id) {
        id = cv.id
        review_id = cv.review_id
        return id, review_id;
      }
      return;
    })
    wx.navigateTo({
      url: `/pages/filmReviewDetails/filmReviewsDetails?id=${id}&review_id=${review_id}`
    })
  },
  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
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
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
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
    this.getRandomPopularMovie(() => {
      wx.stopPullDownRefresh()
    }
    )
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