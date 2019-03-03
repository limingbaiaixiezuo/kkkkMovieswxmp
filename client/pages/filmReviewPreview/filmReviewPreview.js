// pages/filmReviewPreview/filmReviewPreview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()//调用录音借口函数
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
const app = getApp()
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
    let audioFile = decodeURIComponent(options.voiceFilmReview)//decodeURIComponent() 函数可对 encodeURIComponent() 函数编码过的 URI 进行解码。
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
    innerAudioContext.src = this.data.reviewPreviewUserVoiceComment
    innerAudioContext.onPlay(() => {
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
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapBack() {
    wx.navigateBack()
  },
  onTapPubllishReview(){//发布影评函数，调用上传影评函数
    let voiceReview = this.data.reviewPreviewUserVoiceComment
    if (!voiceReview){
      this.doQcloudUploadComment()
    }else{
    this.uploadVoiceReview()
    }
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
      wx.navigateTo({
        url: `/pages/filmReviewList/filmReviewList?id=${id}&filmTitle=${reviewPreviewFirmTitle}&filmImage=${reviewPreviewFirmImage}&wordFilmReview=${reviewPreviewUserWordComment}&voiceFilmReview=${reviewPreviewUserVoiceComment}&userIcon=${reviewPreviewUserIcon}&userName=${reviewPreviewUserName}&filmReviewId=${filmReviewId}&whatKindReview=${whatKindReview}`
      })
  },
  doQcloudUploadComment(cb) {//注意！当我传入的两个参数「（cb,content）」互相污染了
    let content = this.data.reviewPreviewUserWordComment
    let timeOfVoiceReview = this.data.timeOfVoiceReview
    let voiceReviewUrl = cb || null
    wx.showLoading({
      title: '正在发布影评'
    })
      qcloud.request({
        url: config.service.addReview,
        login: true,
        method: 'PUT',
        data: {
          content: content,
          voiceReview: voiceReviewUrl,
          timeOfVoiceReview: timeOfVoiceReview,
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
            }, 100)

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
  uploadVoiceReview() {//上传语音到腾讯云对象存储的函数
  //准备传递到对象存储的语音数据(上传前编码，防止数据丢失)
    let voiceReview = this.data.reviewPreviewUserVoiceComment
    if (voiceReview.length) {
      console.log("待上传语音", voiceReview)
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: voiceReview,
          name: 'file',
          success: res => {
            let data = JSON.parse(res.data)
            if (!data.code) {
              wx.showToast({
                icon: 'none',
                title: '上传成功'
              })
              if (data.data.imgUrl){
              //上传对象存储成功后，返回的对象存储的连接数据，直接作为回调函数的参数
              this.doQcloudUploadComment(data.data.imgUrl)
              }
            }
            setTimeout(() => {
              this.navigateToReviewList()
            }, 1500)
          },
          fail: (err) => {
            wx.showToast({
              icon: 'none',
              title: '上传失败'
            })
            console.log("上传失败错误信息",err)
          }
        })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let filmReviewCount = Math.floor(33 * Math.random());
    let numstamp = Math.floor(this.data.reviewPreviewFirmId * Math.random())
    console.log("随机生成码：" + numstamp); 
    this.setData({
      filmReviewId: this.data.reviewPreviewFirmId + numstamp + filmReviewCount,
      reviewPreviewUserIcon: this.data.userInfo.avatarUrl,
      reviewPreviewUserName: this.data.userInfo.nickName
    })
    filmReviewCount = filmReviewCount + Math.floor(100* Math.random()) ;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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