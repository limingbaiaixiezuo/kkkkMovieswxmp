const DB = require('../utils/db')

module.exports = {

  /**
  * 收藏评论
  */
  addCollect: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let collect_id = +ctx.request.body.collect_id
    let review_id = +ctx.request.body.review_id
    let id = ctx.request.body.id

    if (!isNaN(collect_id)) {
      await DB.query('INSERT INTO user_collect_review(collect_id, id, review_id, user) VALUES (?, ?, ?, ?)', [collect_id, id, review_id, user])
    }

    ctx.state.data = {}
  },
  collectReviewList: async ctx => {// 获取收藏列表数据
    ctx.state.data = await DB.query('SELECT * FROM user_collect_review;')
  },
  
} 