// pages/popularMovies/popularMovies.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // popularMoviesList: app.data.popularMoviesList,
    popularMoviesList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.getPopularMoviesList()
    this.getPopularMoviesList()
  },
  onTapBackHome() {
    wx.navigateBack()
  },
  getPopularMoviesList() {
    wx.showLoading({
      title: '电影数据加载...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          // console.log(result.data)
          this.setData({
            popularMoviesList: result.data.data
          })
          // console.log(this.data.popularMoviesList)
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载失败',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */




  
  onReady: function () {
    console.log("热门电影页面的", this.data.popularMoviesList)
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
    this.getPopularMoviesList()
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
