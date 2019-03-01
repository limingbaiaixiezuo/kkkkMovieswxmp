//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
// var config = require('./config')

// App({
//     onLaunch: function () {
//         qcloud.setLoginUrl(config.service.loginUrl)
//     }
// })
//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2
App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },

  data: {
    locationAuthType: UNPROMPTED,
    popularMoviesList:[],
    filmReviewList:[],
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
        console.log("qcloud成功之后返回的列表数据", data.data)
        if (!data.code) {
          // this.setData({
          //   filmReviewList: data.data
          // })
          this.data.filmReviewList = data.data
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
          // console.log(result.data)
          // this.setData({
          //   popularMoviesList: result.data.data
          // })
          this.data.popularMoviesList = result.data.data
          callback && callback()
          console.log("APP页面的",this.data.popularMoviesList)
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
  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {

          this.data.locationAuthType = UNAUTHORIZED
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
          error && error()
        } else {
          this.data.locationAuthType = AUTHORIZED
          this.doQcloudLogin({ success, error })
        }
      }
    })
  },

  doQcloudLogin({ success, error }) {
    // 调用 qcloud 登陆接口
    //登录可以在小程序和服务器之间建立会话，服务器由此可以获取到用户的标识和信息。
    qcloud.login({
      success: result => {
        console.log(result)
        if (result) {
          let userInfo = result
          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
        console.log('登录成功', userInfo);
      },
      fail: (err) => {
        error && error()
        console.log('登录失败', err)
      }
    })
  },

  getUserInfo({ success, error }) {
    if (userInfo) return userInfo

    qcloud.request({
      url: config.service.user,
      login: true,
      success: result => {
        let data = result.data

        if (!data.code) {
          let userInfo = data.data

          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: (err) => {
        error && error()
        console.log('登录失败', err)
      }
    })
  },

  checkSession({ success, error }) {
    if (userInfo) {
      return success && success({
        userInfo
      })
    }

    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success: res => {
            userInfo = res.userInfo

            success && success({
              userInfo
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      }
    })
  },
})