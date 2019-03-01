const DB = require('../utils/db.js')
   
// 获取所有热门电影数据
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
    
  },
  // 根据特定id获取相应电影数据
  movieDetail: async ctx => {
    filmID = +ctx.params.id
    ctx.state.data = await DB.query('SELECT * FROM movies WHERE movies.id=?', [filmID])
  }
}