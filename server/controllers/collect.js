const DB = require('../utils/db')

module.exports = {

  /**
  * 收藏评论
  */
  addCollect: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    // let username = ctx.state.$wxInfo.userinfo.nickName
    // let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let collect_id = +ctx.request.body.collect_id
    let review_id = +ctx.request.body.review_id
    // let content = ctx.request.body.content || null
    let id = ctx.request.body.id
    // let voiceReview = ctx.request.body.voiceReview || null
    // images = images.join(';;')
    // let testId = review_id

    if (!isNaN(collect_id)) {
      // if (true) {
      await DB.query('INSERT INTO user_collect_review(collect_id, id, review_id, user) VALUES (?, ?, ?, ?)', [collect_id, id, review_id, user])
    }

    ctx.state.data = {}
  },
  collectReviewList: async ctx => {// 获取收藏列表数据
    ctx.state.data = await DB.query('SELECT * FROM user_collect_review;')
  },
  // userCollectReview: async ctx => {// 根据特定user收藏的影评
  //   let user = +ctx.params.user
  //   // let user = ctx.state.$wxInfo.userinfo.openId
  //   ctx.state.data = await DB.query('SELECT * FROM user_collect_review WHERE user_collect_review.user=?', [user])
  // }

  // list: async ctx => {
  //   let user = ctx.state.$wxInfo.userinfo.openId

  //   let list = await DB.query('SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id', [user])
  // }
} 