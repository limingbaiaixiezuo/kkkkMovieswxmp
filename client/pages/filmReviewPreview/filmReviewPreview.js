// pages/filmReviewPreview/filmReviewPreview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()//调用录音借口函数
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
// const _ = require('../../utils/util')
const app = getApp()
// let filmReviewCount = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
        userInfo: null,
        whatKindReview: "",//文字影评还是语音影评
        reviewPreviewFirmImage:'',
        reviewPreviewFirmTitle:'',
        reviewPreviewFirmId: '',
        reviewPreviewUserIcon:'',
        reviewPreviewUserName:'',
        reviewPreviewUserWordComment:'',
        reviewPreviewUserVoiceComment: '',
        filmReviewId:"",
        timeOfVoiceReview:0,
        
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         console.log("影评预览",options)
    let audioFile = decodeURIComponent(options.voiceFilmReview)//decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。
    console.log("decodeURIComponent之后", audioFile)
    this.setData({
      reviewPreviewFirmImage: options.filmImage,
      reviewPreviewFirmTitle: options.filmTitle,
      reviewPreviewFirmId: options.filmId,
      reviewPreviewUserWordComment: options.wordFilmReview,
      reviewPreviewUserVoiceComment: audioFile,
      whatKindReview: options.whatKindEdit,
      timeOfVoiceReview:options.timeOfVoiceReview
    })
  },
  onTapPlayVoiceReview() {//语音播放函数
    // innerAudioContext.autoplay = true
    // innerAudioContext.loop = true
    innerAudioContext.src = this.data.reviewPreviewUserVoiceComment
    innerAudioContext.onPlay(() => {
      console.log('开始播放', this.data.reviewPreviewUserVoiceComment)
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
    console.log('停止播放')
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapBack() {
    // filmReviewCount--
    wx.navigateBack()
  },
  onTapPubllishReview(){//发布影评函数，调用上传影评函数
    this.doQcloudUploadComment()
  },
  navigateToReviewList(){//负责跳转到评论列表的函数，影评上传成功才被调用
    let filmReviewId = this.data.filmReviewId
    let id = this.data.reviewPreviewFirmId
    let reviewPreviewFirmTitle = this.data.reviewPreviewFirmTitle
    let reviewPreviewFirmImage = this.data.reviewPreviewFirmImage
    let reviewPreviewUserIcon = this.data.reviewPreviewUserIcon
    let reviewPreviewUserName = this.data.reviewPreviewUserName
    let reviewPreviewUserWordComment = this.data.reviewPreviewUserWordComment
    let reviewPreviewUserVoiceComment = this.data.reviewPreviewUserVoiceComment
    let whatKindReview = this.data.whatKindReview
    let timeOfVoiceReview = this.data.timeOfVoiceReview
    // setTimeout(() => {
      wx.navigateTo({
        url: `/pages/filmReviewList/filmReviewList?id=${id}&filmTitle=${reviewPreviewFirmTitle}&filmImage=${reviewPreviewFirmImage}&wordFilmReview=${reviewPreviewUserWordComment}&voiceFilmReview=${reviewPreviewUserVoiceComment}&userIcon=${reviewPreviewUserIcon}&userName=${reviewPreviewUserName}&filmReviewId=${filmReviewId}&whatKindReview=${whatKindReview}&timeOfVoiceReview=${timeOfVoiceReview}`
      })
    // }, 2000)
  },
  doQcloudUploadComment(){
    let content = this.data.reviewPreviewUserWordComment
    let voiceReview = this.data.reviewPreviewUserVoiceComment
    if (!content && !voiceReview) return

    wx.showLoading({
      title: '正在发布评论'
    })

    // this.uploadImage(images => {
      qcloud.request({
        url: config.service.addReview,
        login: true,
        method: 'PUT',
        data: {
          content: content,
          voiceReview: voiceReview,
          id: this.data.reviewPreviewFirmId,
          review_id: this.data.filmReviewId
        },
        success: result => {
          wx.hideLoading()
          console.log("review_id", this.data.filmReviewId)
          let data = result.data
          console.log(result,"上传数据成功后的返回数据")
          if (!data.code) {
            wx.showToast({
              title: '发布评论成功'
            })
            setTimeout(() => {
              this.navigateToReviewList()
            }, 1500)

          } else {
            wx.showToast({
              icon: 'none',
              title: '发布评论失败'
            })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.log(err)
          wx.showToast({
            icon: 'none',
            title: '发布评论失败'
          })
        }
      })
    // }
    // )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //每次点击完成按钮，改影片该账户的影评次数都加一，且作为影评唯一编码的一部分
    console.log("已登录用户信息", this.data.userInfo)
      // 获取当前时间戳
    // let timestamp = Date.parse(new Date());
    // timestamp = timestamp / 1000;
    // let timestamp = new Date().valueOf();
    let filmReviewCount = Math.floor(33 * Math.random());
    let numstamp = Math.floor(this.data.reviewPreviewFirmId * Math.random())
    // timestamp = (timestamp / 10000000).floor;
    console.log("随机生成码：" + numstamp); 
    this.setData({
      filmReviewId: this.data.reviewPreviewFirmId + numstamp + filmReviewCount,
      // filmReviewId: this.data.reviewPreviewFirmId + filmReviewCount,
      reviewPreviewUserIcon: this.data.userInfo.avatarUrl,
      reviewPreviewUserName: this.data.userInfo.nickName
    })
    filmReviewCount = filmReviewCount + Math.floor(100* Math.random()) ;
    console.log(filmReviewCount, this.data.filmReviewId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    // this.setData({
    //   locationAuthType: app.data.locationAuthType
    // })
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