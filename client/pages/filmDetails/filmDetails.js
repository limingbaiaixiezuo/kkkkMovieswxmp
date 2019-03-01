// pages/filmDetails/filmDetails.js
let isWriteFilmReview
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filmDetailsImage:"",
    filmDetailsTitle:"",
    filmDetailsDescription:"",
    filmDetailsId:"",
    isWriteFilmReview: false,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
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
  onTapReadyToEditReview(evt) {
    console.log(evt)
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