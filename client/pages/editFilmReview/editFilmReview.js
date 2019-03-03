// pages/editFilmReview/editFilmReview.js
const recorderManager = wx.getRecorderManager()//调用录音借口函数
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    whatKindEdit:"word",//文字影评还是语音影评
    wasEditedFilmReviewFilmImage:"",//被被编辑的电影影评的电影海报
    wasEditedFilmReviewFilmTitle: "",//被被编辑的电影影评的电影名字
    wasEditedFilmReviewFilmId: "",//被被编辑的电影影评的电影唯一识别码
    timeOfAudio:0,
    wordFilmReview:[],//文字影评
    voiceFilmReview:"",//语音影评
  },
  onTapBack() {
    wx.navigateBack()
  },
  onInput(event) {//textarea输入字符触发的事件
    this.setData({
      wordFilmReview: event.detail.value.trim()
    })
  },
  onTapToPreview(evt) {//编辑完影评跳转到影评预览页面
    let audioFile = this.data.voiceFilmReview
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

      const { tempFilePath } = res
      let timeOfAudio = Math.floor(res.duration / 1000)
      let audioFile = encodeURIComponent(res.tempFilePath)
      this.setData({
        voiceFilmReview: audioFile,
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
      const { tempFilePath } = res
      //语音时长
      let timeOfAudio = Math.floor(res.duration / 1000)
      let audioFile = encodeURIComponent(res.tempFilePath)
      this.setData({
        voiceFilmReview: audioFile,
        timeOfAudio: timeOfAudio
      })
    })
    recorderManager.stop()
  },
  onTapPlayVoiceReview(){//语音播放函数
    innerAudioContext.src = decodeURIComponent(this.data.voiceFilmReview)
    innerAudioContext.onPlay(() => {
      wx.showLoading({
        title: '语音播放中',
      })
    })
    innerAudioContext.onError((res) => {
      wx.showToast({
        icon: 'none',
        title: '播放失败'
      })
      wx.hideLoading()
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play()
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