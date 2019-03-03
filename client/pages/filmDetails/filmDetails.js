// pages/filmDetails/filmDetails.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
let isWriteFilmReview
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    filmDetailsImage:"",
    filmDetailsTitle:"",
    filmDetailsDescription:"",
    filmDetailsId:"",
    isWriteFilmReview: false,//是否开始写影评
    wasWriteFilmReview:false,//登录用户是否已经对该部电影写过影评布尔值
    thisFilmReviewList:[],//通过影片的ID筛选出该部影片的全部影评
    filmReviewList:[],
    loginUserReviewedId:null,//登录用户对该部影片的影评的review_id
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filmDetailsImage:options.image,
      filmDetailsTitle:options.title,
      filmDetailsDescription:options.description,
      filmDetailsId: options.id
    })
  },
  onTapBackHome() {
    wx.navigateBack()
  },
  onTapCheckFilmReview() {
    //注意！注意！这里应该是这部电影的全部影评，而不是所有电影的影评列表
    let id = this.data.filmDetailsId
    wx.navigateTo({
      url: `/pages/filmReviewList/filmReviewList?id=${id}`
    })
  },
  onTapToReviewDetails(){//跳转到影评详情页面，并传递登录用户评价的影评信息
    let review_id = this.data.loginUserReviewedId
    let id = this.data.filmDetailsId
    wx.navigateTo({
      url: `/pages/filmReviewDetails/filmReviewsDetails?id=${id}&review_id=${review_id}`
    })
  },
  whetherReviewOrNot() {//检测登录用户是否评价过这部电影
    let filmReviewList = this.data.filmReviewList || null
    let loginId = this.data.userInfo.openId
    let id = this.data.filmDetailsId
  　let condition = false
    let boolearnValue
    let loginUserReviewedId
    let array = []//筛选出的该部影片的所有影评
    
    filmReviewList.forEach(function (cv) {//筛选出该部影片的影评
      if (cv.id == id) {
        array.push(cv)
      }
      return condition = true;//遍历结束
    })
    if (condition && array.length){
      array.forEach(function (cv) {//筛选出该部影片的影评
        if (cv.user == loginId) {
          loginUserReviewedId = cv.review_id
          boolearnValue = true
        }
      })
    }
    setTimeout(() => {
    this.setData({
      wasWriteFilmReview: boolearnValue || null,//登录用户是否已经对该部电影写过影评布尔值
      loginUserReviewedId: loginUserReviewedId || null
    })
    }, 500)
  },
  onTapReadyToEditReview(evt) {
    let editKind = evt.target.id
    let image = this.data.filmDetailsImage
    let title = this.data.filmDetailsTitle
    let id = this.data.filmDetailsId
    wx.navigateTo({
      url: `/pages/editFilmReview/editFilmReview?id=${id}&title=${title}&image=${image}&editKind=${editKind}`
    })
  },
  onTapToAddFilmReview() {
    wx.showToast({
      icon: 'none',
      title: "你的文字一定很美"
    })

    this.setData({
      isWriteFilmReview: true
    })
  },
  onTapCancelWriteFilmReview() {
    wx.showToast({
      icon: 'none',
      title: "半途而废"
    })

    this.setData({
      isWriteFilmReview: false
    })
  },
  getReviewList() {
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        let data = result.data
        if (!data.code && data.data) {
          this.setData({
            filmReviewList: data.data
          })
          this.whetherReviewOrNot()//全部影评数据下载成功且有影评之后再筛选
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评列表数据加载失败',
          })
        }
      },
      fail: result => {
        console.log(result, '影评列表数 据加载失败')
        wx.showToast({
          icon: 'none',
          title: '影评列表数 据加载失败',
        })
      }
    })
  },
  getThisFilmReview(arg) {//获取特定影评函数
    qcloud.request({
      url: config.service.thisReviewList + arg,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评数据加载失败',
          })
        }
      },
      fail: result => {
        console.log(result, '777影评数据加载失败')
        wx.showToast({
          icon: 'none',
          title: '影评数据加载失败',
        })
      }
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
    
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.getReviewList()
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