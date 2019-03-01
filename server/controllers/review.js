const DB = require('../utils/db')

module.exports = {

  /**
  * 添加评论
  */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let review_id = +ctx.request.body.review_id
    let content = ctx.request.body.content || null
    let id = ctx.request.body.id
    let voiceReview = ctx.request.body.voiceReview || null
    // images = images.join(';;')
    // let testId = review_id
    
    if (!isNaN(review_id)) {
    // if (true) {
      await DB.query('INSERT INTO review(id, user, username, avatar, content, voiceReview, review_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, user, username, avatar, content, voiceReview, review_id])
    }

    ctx.state.data = {}
  },
  /**
   * 获取评论列表
   */
  reviewList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM review")
    
  },
  // 根据特定review_id获取相应影评数据
  reviewDetail: async ctx => {
    reviewId = +ctx.params.review_id
    ctx.state.data = await DB.query('SELECT * FROM review WHERE review.review_id=?', [reviewId])
  },
  // 根据特定id获取相应影评数据
  // reviewDetail2: async ctx => {
  //   id = +ctx.params.id
  //   ctx.state.data = await DB.query('SELECT * FROM review WHERE review.id=?', [id])
  // }
} 