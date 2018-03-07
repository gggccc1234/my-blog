var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentsSchema = new Schema({
  "articleId": String,
  // 文章id
  "userId": String,
  // 用户id
  "commentText": String,
  // 评论详情
  "good": Number,
  // 点赞数
  "bad": Number,
  // 点踩数
  "top": Boolean,
  // 是否置顶
  "userName": String,
  // 用户名
  "userAvatarUrl": String,
  // 用户头像
  "ptime": String,
  // 评论时间
  "floor": Number,
  // 层数
  "to": String,
  // 回复楼层
  "from": String
})

var articledetailsSchema = new Schema ({
  "articleId": String,
  // 文章id
  "userId": String,
  // 用户id
  "articleContent": String,
  // 文章详情
  "articleComments": [commentsSchema]
  // 评论列表
})

module.exports = mongoose.model('Articledetails', articledetailsSchema)