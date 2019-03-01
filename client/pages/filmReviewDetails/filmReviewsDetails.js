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
    isWriteFilmReview:false,
    wasCollectedReview:false,
    popularMoviesDetails:{},
    collect_id:0,
    // wordFilmReview:"",
    // videoFilmReview:"",
    filmReviewDetails:{},
    userInfo: null,
    filmReviewList:[],
    // reviewsDetilsTotalInfo:[{
    //   filmDetailsImage: "",
    //   filmDetailsTitle: "",
    //   filmDetailsId: "",
    //   loginUserIcon:"",
    //   loginUserName:"",
      // loginUserId:""
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let review_id = options.review_id
    let numstamp = Math.floor(id*review_id* Math.random()/100)
    // this.setData({
    //   collect_id: id + numstamp
    // })
    this.getDetailsPopularMovies(id) // 下载特定电影ID的电影
    // setTimeout(() => {
    this.getDetailsReview(review_id)//下载特定影评ID的影评
    // }, 2000)
    this.getReviewList()
    console.log("影评列表传递的", options)
    this.setData({
      collect_id: id + numstamp,
      isWriteFilmReview: false//初始化底部弹出菜单栏布尔值
    })
  },
  onTapBack() {//返回上一步函数
    // filmReviewCount--
    wx.navigateBack()
  },
  onTapPlayVoiceReview() {//语音播放函数
    innerAudioContext.src = this.data.filmReviewDetails.voiceReview
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
  onStopPlayVoiceReview() {//停止播放语音函数
    wx.hideLoading()
    innerAudioContext.stop()
    console.log('停止播放')
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapCollectReview(){//收藏影评函数
    this.setData({
      wasCollectedReview: true
    })
    this.doQcloudUploadCollectReview()
    // let collect_id= this.data.collect_id
    // let id = this.data.popularMoviesDetails.id
    // let review_id = this.data.filmReviewDetails.review_id
    // let user = this.data.userInfo.openID
    // wx.navigateTo({
    //   url: `/pages/user/user?collect_id=${collect_id}&id=${id}&review_id=${review_id}&user=${user}`
    // })

  },
  onTapWriteFilmReview(){//开始写评论
    // if (userInfo) return userInfo
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
        console.log("已经评价过！影评：", loginUserReviewForFilm)
      }
    })
    console.log("TEST222",thisMovieReviewArray)
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
      // wx.navigateTo({
      //   url: `/pages/filmReviewDetails/filmReviewsDetails?id=${filmDetailsId}&title=${filmDetailsTitle}&image=${filmDetailsImage}&editKind=${editKind}`
      // })
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
    // wx.showLoading({
    //   title: '电影数据加载...',
    // })
    qcloud.request({
      url: config.service.movieDetail + arg,
      success: result => {
        // wx.hideLoading()
        if (!result.data.code) {
          console.log("下载的热门电影数据",result)
          this.setData({
            popularMoviesDetails: result.data.data[0]
          })
          console.log("电影详情信息",this.data.popularMoviesDetails)
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
    // wx.showLoading({
    //   title: '下载影评列表数据中...',
    // })
    qcloud.request({
      url: config.service.reviewDetail + arg,
      success: result => {
        // wx.hideLoading()
        let data = result.data
        // console.log("电影详情数据", data.data)
        if (!data.code) {
          this.setData({
            filmReviewDetails: data.data[0]
          })
          // console.log("影评详情信息", this.data.filmReviewDetails)
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评列表数据加载失败',
          })
        }
      },
      fail: result => {
        // console.log(result)
        // wx.hideLoading()
        console.log(result, '影评列表数 据加载失败')
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
        console.log("qcloud成功之后返回的列表数据", data.data)
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
        // wx.hideLoading()
        console.log(result, '影评列表数 据加载失败')
        wx.showToast({
          icon: 'none',
          title: '影评列表数 据加载失败',
        })
      }
    })
  },
  doQcloudUploadCollectReview() {//上传收藏的影评数据
    //思考如何防止上传的收藏数据重复！！！
    // let content = this.data.reviewPreviewUserWordComment
    // let voiceReview = this.data.reviewPreviewUserVoiceComment
    // if (!content && !voiceReview) return
    let collect_id = this.data.collect_id
    let id = this.data.popularMoviesDetails.id
    let review_id = this.data.filmReviewDetails.review_id
    // let user = this.data.userInfo.openID
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
        // user: user
      },
      success: result => {
        wx.hideLoading()
        // console.log("review_id", this.data.filmReviewId)
        let data = result.data
        console.log("收藏的影评数据上传成功后返回的数据",result)
        if (!data.code) {
          wx.showToast({
            title: '收藏评论成功'
          })
          // setTimeout(() => {
          //   this.navigateToReviewList()
          // }, 1500)

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
  onTapReadyToEditReview(evt) {//侦测具体是写文字还是语音影评之后，跳转到影评编辑页面。
    console.log("影评详情页面写影评",evt)
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
    // console.log("已登录用户信息", this.data.userInfo)
    // let collectReviewCount = Math.floor(7* Math.random());
    // let numstamp = Math.floor(this.data.id * Math.random())
    // timestamp = (timestamp / 10000000).floor;
    // console.log("随机生成码：",numstamp);
    // let id = this.data.popularMoviesDetails.id
    // let numstamp = Math.floor(id * Math.random()*10)
    // let collect_id = this.data.
    // this.setData({
    //   collect_id: id + numstamp + collectReviewCount,
    // })
    // filmReviewCount = collectReviewCount + Math.floor(10 * Math.random());
    console.log("collect_id", this.data.collect_id)
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
    console.log("登陆者账户信息",this.data.userInfo)
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