// pages/editFilmReview/editFilmReview.js
const recorderManager = wx.getRecorderManager()//调用录音借口函数
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
// const app = getApp()
// let filmReviewCount = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whatKindEdit:"word",//文字影评还是语音影评
    // userInfo: null,
    wasEditedFilmReviewFilmImage:"",//被被编辑的电影影评的电影海报
    wasEditedFilmReviewFilmTitle: "",//被被编辑的电影影评的电影名字
    wasEditedFilmReviewFilmId: "",//被被编辑的电影影评的电影唯一识别码
    // filmReviewId:"",
    // filmReviewCount:0,
    timeOfAudio:0,
    wordFilmReview:[],//文字影评
    voiceFilmReview:"",//语音影评
    // tempFilePath: ""//语音影评地址
  },
  onTapBack() {
    wx.navigateBack()
  },
  //textarea输入字符触发的事件
  onInput(event) {
    // console.log(event.detail.value)
    this.setData({
      wordFilmReview: event.detail.value.trim()
    })
  },
  //编辑完影评跳转到影评预览页面
  onTapToPreview(evt){
    // console.log(this.data.filmReviewCount)
    // let editKind = evt.target.id
    let audioFile = encodeURIComponent(this.data.voiceFilmReview) //将音频字符串转义成URL后，再传递，否则会丢失部分字符，进而导致在不能在其它页面播放（开发工具不行，真机可以）；先整体将 url 使用 encodeURI() 处理下，再传递，然后拿到之后再用 decodeURI() 转回来
    console.log("encodeURIComponent之后", audioFile)
    let wasEditedFilmReviewFilmImage = this.data.wasEditedFilmReviewFilmImage
    let wasEditedFilmReviewFilmTitle = this.data.wasEditedFilmReviewFilmTitle
    let wasEditedFilmReviewFilmId = this.data.wasEditedFilmReviewFilmId
    let wordFilmReview = this.data.wordFilmReview
    let voiceFilmReview = audioFile
    let whatKindEdit = this.data.whatKindEdit
    let timeOfVoiceReview = this.data.timeOfAudio
    wx.navigateTo({
      url: `/pages/filmReviewPreview/filmReviewPreview?filmId=${wasEditedFilmReviewFilmId}&filmTitle=${wasEditedFilmReviewFilmTitle}&filmImage=${wasEditedFilmReviewFilmImage}&wordFilmReview=${wordFilmReview}&voiceFilmReview=${voiceFilmReview}&whatKindEdit=${whatKindEdit}&timeOfVoiceReview=${timeOfVoiceReview}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"编辑影片页面或者影评详情页面传入信息")
    this.setData({
      wasEditedFilmReviewFilmImage: options.image,
      wasEditedFilmReviewFilmTitle: options.title,
      wasEditedFilmReviewFilmId: options.id,
      whatKindEdit:options.editKind
    })
  },
  onTouchStartRecord(){//录音函数
    recorderManager.onStart(() => {
      wx.showLoading({
        title: '开始录音中...',
      })
      // wx.showToast({
      //   title: '开始录音',
      //   icon: 'onRecording'
      // })
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options)
    recorderManager.onStop((res) => {
      wx.hideLoading()
      wx.showToast({
        title: '录音时间不能超过十秒限定',
      })

      console.log('recorder stop１', res)
      const { tempFilePath } = res
      let timeOfAudio = Math.floor(res.duration / 1000)

      this.setData({
        voiceFilmReview: res.tempFilePath,
        timeOfAudio: timeOfAudio
      })
    })
  },
  onTouchStopRecord() {//停止录音函数
    recorderManager.onStop((res) => {
      wx.hideLoading()
      wx.showToast({
        title: '录音结束',
      })
      
      console.log('recorder stop２', res)
      const { tempFilePath } = res
      //语音时长
      let timeOfAudio = Math.floor(res.duration / 1000)
      this.setData({
        voiceFilmReview: res.tempFilePath,
        timeOfAudio: timeOfAudio
      })
    })

    recorderManager.stop()
  },
  onTapPlayVoiceReview(){//语音播放函数
    // innerAudioContext.autoplay = true
    // innerAudioContext.loop = true
    innerAudioContext.src = this.data.voiceFilmReview
    innerAudioContext.onPlay(() => {
      wx.showLoading({
        title: '语音播放中',
      })
      console.log('开始播放', this.data.voiceFilmReview)
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
    innerAudioContext.onStop(
      wx.hideLoading(),
      wx.showLoading({
        title: '播放结束',
      })
    )
  },
  onStopPlayVoiceReview(){
    innerAudioContext.stop()
    wx.hideLoading()
    console.log('停止播放')
    wx.showToast({
      title: '播放结束',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("已登录用户信息", this.data.userInfo)
    // this.setData({
    //   filmReviewId: this.data.wasEditedFilmReviewFilmId + this.data.userInfo.openId + this.data.filmReviewCount
    // })
    // console.log(this.data.filmReviewCount, this.data.filmReviewId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    // this.setData({
    //   locationAuthType: app.data.locationAuthType
    // })
    // app.checkSession({
    //   success: ({ userInfo }) => {
    //     this.setData({
    //       userInfo
    //     })
    //   }
    // })
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