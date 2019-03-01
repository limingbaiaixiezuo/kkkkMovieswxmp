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
    // this.filterReview()
    
  },
  filterReview(){//根据影片ID过滤全部的影评数据
    let filmReviewList = this.data.filmReviewList
    let thisFilmId = this.data.thisFilmId
    // let thisFilmReviewList = this.data.thisFilmReviewList
    let filterReviewArray = []
    filmReviewList.forEach(function (cv) {//遍历影评数据，找出电影的所有影评
      if (cv.id == thisFilmId) {
        filterReviewArray.push(cv)
      }
    })
    // filterReviewArray.forEach(function (cv) {//遍历过滤后的影评数据，找出语音影评，提取时间
    //   if (cv.id == thisFilmId) {
    //     filterReviewArray.push(cv)
    //   }
    // })
    console.log("筛选过的", filterReviewArray)
    // console.log("语音", filterReviewArray[1].voiceReview)
    this.setData({
      thisFilmReviewList: filterReviewArray
    })
  },
  onTapBack() {
    wx.navigateBack()
  },
  onTapBackToHome() {
    // let moviesInfo = this.data.getRandomPopularMovie
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
        if (!data.code) {
          this.setData({
            filmReviewList: data.data
            })
          callback && callback()
          this.filterReview()//全部影评数据下载成功之后再筛选
      } else {
        wx.showToast({
          icon: 'none',
          title: '影评列表数据加载失败',
        })
      }
    },
      fail: result => {
        // console.log(result)
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
    // innerAudioContext.autoplay = true
    // innerAudioContext.loop = true
    console.log("影评列表被点击的影评", evt.currentTarget.id)
    // innerAudioContext.src = ""
    let innerAudio
    let audioContext = this.data.filmReviewList
    console.log("影评列表", audioContext)
    // for (let index = 0; index < audioContext.length;index++){
    //   if (audioContext[index].review_id == evt.currentTarget.id){
    //     innerAudio = audioContext[index].voiceReview
    //     console.log("匹配到", innerAudio)
    //   }
    //   return;
    // }
    audioContext.forEach(function (cv) {
       if(cv.review_id == evt.currentTarget.id){
         console.log("影评TEST列表", cv.review_id, evt.currentTarget.id)
         innerAudio = cv.voiceReview
         return innerAudio;
       }
      return;
    })
    console.log("被点击的语音", innerAudio)
    innerAudioContext.src = innerAudio
    innerAudioContext.onPlay(() => {
      wx.showLoading({
        title: '语音播放中...',
      })
      console.log('开始播放', innerAudioContext.src)
    })
    innerAudioContext.onError((res) => {
      wx.showToast({
        icon: 'none',
        title: '录音失败'
      })
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play()
  },
  onStopPlayVoiceReview() {
    innerAudioContext.stop()
    wx.hideLoading()
    console.log('停止播放')
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapToReviewDetails(evt){//跳转到影评详情页面
    console.log("wqwqwwq点击的影评", evt.currentTarget.id)

    // let avatar
    // let content
    let id
    let review_id
    // let user
    // let username
    // let voiceReview
    // let whatKindEdit = this.data.whatKindEdit
    // let timeOfVoiceReview = this.data.timeOfAudio
    let reviewArray = this.data.filmReviewList
    console.log("影评列表", reviewArray)
    reviewArray.forEach(function (cv) {
      if (cv.review_id == evt.currentTarget.id) {
        console.log("影评TEST列表", cv.review_id, evt.currentTarget.id)
        // avatar = cv.avatar
        // content = cv.content
        id = cv.id
        review_id = cv.review_id
        // user = cv.user
        // username = cv.username
        // voiceReview = cv.voiceReview
        return id, review_id;
      }
      return;
    })
    console.log("TEST",id, review_id)
    wx.navigateTo({
      url: `/pages/filmReviewDetails/filmReviewsDetails?id=${id}&review_id=${review_id}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("２２２data", this.data.filmReviewList)
    //  setTimeout(() => {
    //    this.getReviewList()
    //         }, 3000)
    // this.getReviewList()
    // console.log(121212)
    // console.log("返回的影评列表数据", this.data.filmReviewList)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.filterReview()
    // console.log(121212)
    // console.log("３３３data", this.data.filmReviewList)
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