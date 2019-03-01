// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()//调用播放语音借口函数
const app = getApp()
let isCollectOrRelease
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isLogin:true,
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    isCollectOrRelease:true,
    loginUserCollectedReviewInfo: [],//收藏的影评展示所需要的数据，综合电影、影评、收藏数据
    loginUserReleasedReviewInfo: [],//发布的影评展示所需要的数据，综合电影、影评、收藏数据
    loginUserCollectedReview: [],//登录的用户收藏数据
    loginUserRelesedReview: [],//登录的用户发布的影评
    // allCollectedReview: [],//所有被收藏的影评
    popularMoviesList:[],
    filmReviewList:[],
    collectMoviesList:[
    {
      collectMoviesImage: "/images/example.png",
      collectMoviesTitle: "流浪地球",
      collectMoviesReview: "niubi牛逼牛逼科幻剧情战争",
      collectMoviesReviewName: "李明白",
      collectMoviesReviewIcon: "/images/example.png"
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.downloadCollecrReview()//下载所有收藏数据
        // this.downloadCollecrReview()//下载用户自己发布的影评
    this.getReviewList()
    this.getPopularMoviesList()
  },
  onTapToReviewDetails(evt) {//跳转到影评详情页面
    console.log("点击事件", evt.currentTarget.id)
    let id
    let review_id
    let reviewArray = this.data.filmReviewList
    // console.log("影评列表", reviewArray)
    reviewArray.forEach(function (cv) {
      if (cv.review_id == evt.currentTarget.id) {
        console.log("影评TEST列表", cv.review_id, evt.currentTarget.id)
        id = cv.id
        review_id = cv.review_id
        return id, review_id;
      }
      return;
    })
    console.log("TEST", id, review_id)
    wx.navigateTo({
      url: `/pages/filmReviewDetails/filmReviewsDetails?id=${id}&review_id=${review_id}`
    })
  },
  getDisplayInfo(){//获取“我的”页面显示所需数据
    let collectInfo = this.data.loginUserCollectedReview
    let reviewInfo = this.data.filmReviewList
    let filmInfo = this.data.popularMoviesList
    let userInfo = this.data.userInfo.openId
    let displayCollectedReviewInfo = []//“收藏的影评”显示所需数据
    let displayReleasedReviewInfo = []//“收藏的影评”显示所需数据
    
    //注意！注意！关联数据数组的长度与收藏影评数据数组的长度相同
    let array1 = []//筛选出的与收藏数据关联的影评数据
    let array2 = []//筛选出的与收藏数据关联的电影数据
    let array3 = []//筛选出的与发布数据关联的影评数据
    let array4 = []//筛选出的与发布数据关联的电影数据
    console.log("array３,array４", array3 ,array4)
    collectInfo.forEach(function (cv) {
      reviewInfo.forEach(function (cv1) {//筛选出的与收藏数据关联的影评数据
        if (cv.review_id == cv1.review_id) {
          array1.push(cv1)
        }
      }),
      filmInfo.forEach(function (cv2) {//筛选出的与收藏数据关联的电影数据
        if (cv.id == cv2.id) {
          array2.push(cv2)
        }
      })
      
    }),
    reviewInfo.forEach(function (cv3) {//筛选出登录用户发布的所有影评数据
        if (cv3.user == userInfo) {
    //注意！注意！array3数组的顺序是按照review_id的升序排列！而array4按id的升序排列！
          array3.push(cv3)
        }
        
    }),
      filmInfo.forEach(function (cv4) {//筛选出登录用户发布的所有影评数据关联电影数据
      setTimeout(() => {//考虑到array3须由上面合成需要时间
        array3.forEach(function (cv3) {//根据筛选出的影评筛选电影
          if (cv3.id == cv4.id) {
            array4.push(cv4)
          }
        })
      }, 100)  
    })
    
    for (let i = 0; i < collectInfo.length; i++) {
      let obj = {}
      obj.username = array1[i].username
      obj.avatar = array1[i].avatar
      obj.review_id = array1[i].review_id
      obj.content = array1[i].content
      obj.voiceReview = array1[i].voiceReview
      obj.title = array2[i].title
      obj.image = array2[i].image

      displayCollectedReviewInfo.push(obj)
    }
    //注意！注意！array3数组的顺序是按照review_id的升序排列！而array4按id的升序排列！
    array3 = array3.sort(function (a, b) { return a.id - b.id })//按id的升序排列
    // console.log("NEWarray３,array４", array3, array4)
  setTimeout(() => {//考虑到array4须由上面合成需要时间 
    for (let i = 0; i < array3.length; i++) {
      let obj = {}
      obj.username = array3[i].username
      obj.avatar = array3[i].avatar
      obj.review_id = array3[i].review_id
      obj.content = array3[i].content
      obj.voiceReview = array3[i].voiceReview
      obj.title = array4[i].title
      obj.image = array4[i].image

      displayReleasedReviewInfo.push(obj)
    }
   
    console.log("displayCollectedReviewInfo", displayCollectedReviewInfo)
    console.log("displayReleaseReviewInfo", displayReleasedReviewInfo)
    this.setData({
      loginUserCollectedReviewInfo: displayCollectedReviewInfo,
      loginUserReleasedReviewInfo: displayReleasedReviewInfo
    })
   }, 150) 
  },
  onTapBackHome() {
    wx.navigateBack()
    
  },
  onTapPlayVoiceReview(evt) {//根据点击事件传递的数据播放相应的语音的函数
    // console.log("影评列表被点击的影评", evt.currentTarget.id)
    let innerAudio
    let audioContext = this.data.filmReviewList
    // console.log("影评列表", audioContext)
    
    audioContext.forEach(function (cv) {
      if (cv.review_id == evt.currentTarget.id) {
        // console.log("影评TEST列表", cv.review_id, evt.currentTarget.id)
        innerAudio = cv.voiceReview
        return innerAudio;
      }
      return;
    })
    // console.log("被点击的语音", innerAudio)
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
  onStopPlayVoiceReview() {//停止播放语音
    innerAudioContext.stop()
    wx.hideLoading()
    console.log('停止播放')
    wx.showToast({
      title: '播放结束',
    })
  },
  onTapLogin: function () {//点击登录账户函数
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
  downloadCollecrReview(){//下载用户收藏的影评
    qcloud.request({
      url: config.service.collectReviewList,
      success: result => {
        // wx.hideLoading()
        if (!result.data.code) {
          console.log(" 所有收藏的影评数据", result.data.data)
          let userId = this.data.userInfo.openId
          let loginUserCollectedReview = []
          result.data.data.forEach(function (cv) {//获取登录用户的收藏数据
            if (cv.user == userId) {
              loginUserCollectedReview.push(cv)
            }
          })
          this.setData({
            loginUserCollectedReview: loginUserCollectedReview
          })
          setTimeout(() => {
            this.getDisplayInfo()//调用合成“我的”页面用户数据
          }, 300)
          console.log("登录用户收藏的影评", this.data.loginUserCollectedReview)
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
  getReviewList(callback) {
    wx.showLoading({
      title: '下载影评列表数据中...',
    })
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log("影评列表数据", data.data)
        if (!data.code) {
          this.setData({
            filmReviewList: data.data
          })
          // this.data.filmReviewList = data.data
          callback && callback()
          // this.filterReview()//全部影评数据下载成功之后再筛选
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
          title: '影评列表数 据加载失败',
        })
      }
    })
  },
  getPopularMoviesList(callback) {
    wx.showLoading({
      title: '电影数据加载...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          console.log(result.data)
          this.setData({
            popularMoviesList: result.data.data
          })
          // this.data.popularMoviesList = result.data.data
          callback && callback()
          console.log("热门电影列表", this.data.popularMoviesList)
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
  // downloadCollecrReview(){
    
  // },
  collectOrRelease() {//切换显示收藏或已经发布的影评
    isCollectOrRelease = !isCollectOrRelease
    this.setData({
      isCollectOrRelease
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
        // let user = this.data.userInfo.openId
        this.downloadCollecrReview()//下载所有收藏的影评
        // // this.downloadCollecrReview()//下载用户自己发布的影评
        // console.log(111)
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