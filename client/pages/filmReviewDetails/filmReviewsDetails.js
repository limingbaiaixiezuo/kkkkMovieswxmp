// pages/filmReviewDetails/filmReviewsDetails.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
const app = getApp()
let isWriteFilmReview
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWriteFilmReview:false,//是否写影评
    wasCollectedReview:false,//当前手否已经收藏布尔值
    doNotSecondCollect:false,//禁止二次收藏布尔值
    popularMoviesDetails:{},
    collect_id:0,
    review_id: 0,
    filmReviewDetails:{},
    userInfo: null,
    filmReviewList:[],
    loginUserCollectedReview:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let review_id = options.review_id
    let numstamp = Math.floor(id*review_id* Math.random()/100)
    this.getDetailsPopularMovies(id) // 下载特定电影ID的电影
    this.getDetailsReview(review_id)//下载特定影评ID的影评
    this.getReviewList()
    this.downloadCollecrReview()//调用下载收藏数据的函数
    this.setData({
      collect_id: id + numstamp,//为收藏影评而提前生成的收藏ID
      review_id: options.review_id
    })
  },
  onTapBack() {//返回上一步函数
    wx.navigateBack()
  },
  onTapPlayVoiceReview() {//语音播放函数
    innerAudioContext.src = this.data.filmReviewDetails.voiceReview
    innerAudioContext.onPlay(() => {
      wx.showLoading({
        title: '语音播放中...',
      })
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
  onStopPlayVoiceReview() {//停止播放语音函数
    wx.hideLoading()
    innerAudioContext.stop()
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapCollectReview(){//收藏影评函数
    let doNotSecondColect = this.data.doNotSecondColect
    if (!doNotSecondColect){
    this.setData({
      wasCollectedReview: true
    })
    this.doQcloudUploadCollectReview()
    }else{
      wx.showToast({
        icon: 'none',
        title: "已经收藏，不可以二次收藏"
      })
    }
  },
  onTapWriteFilmReview(){//开始写评论
    let wasReviewed = false
    let loginUserReviewForFilm = []//用户对该影片的全部影评
    let thisMovieReviewArray = []
    let loginId = this.data.userInfo.openId//用户ID
    let filmId = this.data.popularMoviesDetails.id//是否已经被用户写了影评的电影的ID
    let filmReviewList = this.data.filmReviewList
    filmReviewList.forEach(function (cv) {//遍历影评数据，找出电影的所有影评
      if (cv.id == filmId) {
        thisMovieReviewArray.push(cv)
      }
    })
    thisMovieReviewArray.forEach(function (cv) {//遍历该影片的全部影评数据，检测用户是否已经评价
      if (cv.user == loginId) {
        wasReviewed = true;
        loginUserReviewForFilm.push(cv)
      }
    })
    wx.showToast({
      icon: 'none',
      title:"你的文字一定很美"
    })
    if(!wasReviewed){
    this.setData({
      isWriteFilmReview: true
    })
    }else{
      wx.showToast({
        icon: 'none',
        title: "已经评价过，一部影片只能评价一次"
      })
      this.setData({//如果已经评价过，则把评价的信息传入到影评详情页面
        filmReviewDetails: loginUserReviewForFilm[0]
      })
    }
  },
  onTapCancelWriteFilmReview() {//取消评论
    wx.showToast({
      icon: 'none',
      title: "半途而废"
    })
    this.setData({
      isWriteFilmReview: false
    })
  },
  getDetailsPopularMovies(arg) {//获取特定热门电影函数
    qcloud.request({
      url: config.service.movieDetail + arg,
      success: result => {
        if (!result.data.code) {
          this.setData({
            popularMoviesDetails: result.data.data[0]
          })
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
  getDetailsReview(arg) {//获取特定影评函数
    qcloud.request({
      url: config.service.reviewDetail + arg,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            filmReviewDetails: data.data[0]
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
  getReviewList(callback) {//获取影评列表数据的函数
    wx.showLoading({
      title: '下载影评列表数据中...',
    })
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            filmReviewList: data.data
          })
          callback && callback()
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
  doQcloudUploadCollectReview() {//上传收藏的影评数据
    let collect_id = this.data.collect_id
    let id = this.data.popularMoviesDetails.id
    let review_id = this.data.filmReviewDetails.review_id
    wx.showLoading({
      title: '正在发布评论'
    })

    qcloud.request({
      url: config.service.addCollect,
      login: true,
      method: 'PUT',
      data: {
        collect_id: collect_id,
        id: id,
        review_id: review_id,
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '收藏评论成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏评论失败'
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
  },
  downloadCollecrReview() {//下载用户收藏的影评的函数
    qcloud.request({
      url: config.service.collectReviewList,
      success: result => {
        if (!result.data.code) {
          let userId = this.data.userInfo.openId
          let loginUserCollectedReview = []
          result.data.data.forEach(function (cv) {//获取登录用户的收藏数据
            if (cv.user == userId) {
              loginUserCollectedReview.push(cv)
            }
          })
          
          let currentReviewID = this.data.review_id//获取当前影评的ID
          let wasCollectedReview
            loginUserCollectedReview.forEach(function (cv) {//遍历收藏数据，检测是否已经被收藏
              if (cv.review_id == currentReviewID) {
                wasCollectedReview = true
              }
            })
          if (wasCollectedReview){
          this.setData({
            wasCollectedReview: wasCollectedReview,
            loginUserCollectedReview: loginUserCollectedReview,
            doNotSecondColect: true //不可以二次收藏
          })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '用户收藏的影评数据加载失败',
          })
        }
      },
      fail: result => {
        console.log("用户收藏的影评数据加载失败result", result)
        wx.showToast({
          icon: 'none',
          title: '用户收藏的影评数据加载失败',
        })
      }
    })
  },
  onTapReadyToEditReview(evt) {//侦测具体是写文字还是语音影评之后，跳转到影评编辑页面。
    let editKind = evt.target.id
    let filmDetailsImage = this.data.popularMoviesDetails.image
    let filmDetailsTitle = this.data.popularMoviesDetails.title
    let filmDetailsId = this.data.popularMoviesDetails.id
    wx.navigateTo({
      url: `/pages/editFilmReview/editFilmReview?id=${filmDetailsId}&title=${filmDetailsTitle}&image=${filmDetailsImage}&editKind=${editKind}`
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