// pages/filmReviewList/filmReviewList.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
const recorderManager = wx.getRecorderManager()//调用录音借口函数
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
let reviewArray = [];
let objectInfo = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filmReviewList:[],//全部影评列表
    thisFilmId:0,//电影ID
    thisFilmReviewList:[]//该部电影的全部影评
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      thisFilmId: options.id
    })
    console.log("options", options)
    this.getReviewList()
  },
  getTimeofVoiceReviewAndTrimContent() {//获取语音影评时长函数和修剪文字影评
    let timeOfVoiceReview
    let trimContent
    this.data.thisFilmReviewList.forEach(function (cv) {//有语音的对象中增加时间项
      if(cv.content){
        trimContent = cv.content.slice(0,14)
        cv.content = trimContent
      }
    })
    this.setData({
      thisFilmReviewList: this.data.thisFilmReviewList
    })
  },
  filterReview(){//根据影片ID过滤全部的影评数据
    let filmReviewList = this.data.filmReviewList
    let thisFilmId = this.data.thisFilmId
    let filterReviewArray = []
    filmReviewList.forEach(function (cv) {//遍历影评数据，找出电影的所有影评
      if (cv.id == thisFilmId) {
        filterReviewArray.push(cv)
      }
    })
    this.setData({
      thisFilmReviewList: filterReviewArray
    })
    this.getTimeofVoiceReviewAndTrimContent()
  },
  onTapBack() {
    wx.navigateBack()
  },
  onTapBackToHome() {
    wx.navigateTo({
      url: "/pages/homePage/homePage",
      fail: (res) => {
        console.log(res)
      }
    })
  },
  getReviewList(callback) {
    wx.showLoading({
      title: '下载影评列表数据中...',
    })
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log("qcloud成功之后返回的列表数据",data.data)
        if (!data.code && data.data) {
          this.setData({
            filmReviewList: data.data
            })
          callback && callback()
          this.filterReview()//全部影评数据下载成功且有影评之后再筛选
      } else {
        wx.showToast({
          icon: 'none',
          title: '影评列表数据加载失败',
        })
      }
    },
      fail: result => {
        wx.hideLoading()
        console.log(result, '影评列表数 据加载失败')
        wx.showToast({
          icon: 'none',
          title:'影评列表数 据加载失败',
        })
      }
    })
  },
  onTapPlayVoiceReview(evt) {//根据点击事件传递的数据播放相应的语音的函数
    let innerAudio
    let audioContext = this.data.filmReviewList
    audioContext.forEach(function (cv) {
       if(cv.review_id == evt.currentTarget.id){
         innerAudio = cv.voiceReview
       }
    })
    innerAudioContext.src = innerAudio
    innerAudioContext.onPlay(() => {
      wx.showLoading({
        title: '语音播放中...',
      })
    })
    innerAudioContext.onError((res) => {
      wx.showToast({
        icon: 'none',
        title: '语音播放失败'
      })
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play()
  },
  onStopPlayVoiceReview() {
    innerAudioContext.stop()
    wx.hideLoading()
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapToReviewDetails(evt){//跳转到影评详情页面
    let id
    let review_id
    let reviewArray = this.data.filmReviewList
    console.log("影评列表", reviewArray)
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
    this.getReviewList(() => {
      wx.stopPullDownRefresh()})
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