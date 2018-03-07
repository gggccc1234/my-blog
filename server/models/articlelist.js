var mongoose = require('mongoose')
var Schema = mongoose.Schema

labelsSchema = new Schema ({
  labelName: String
  // 标签名
})

var articlesSchema = new Schema ({
  "articleId" : String,
  // 文章id
  "userId" : String,
  // 作者id
  "userName" : String,
  // 作者名字
  "userAvatarUrl" : String,
  // 作者头像
  "publishTime" : String,
  // 发表时间
  "articleVisit" : Number,
  // 文章访问量
  "articleComment" : Number,
  // 文章评论量
  "articleLove" : Number,
  // 文章收藏量
  "articleTitle" : String,
  // 文章题目
  "articleLabels" : [labelsSchema],
  // 文章标签分类列表
  "articleSummary" : String,
  // 文章简介
  "articleAvatarUrl": String,
  // 文章封面图
  "loop": Boolean,
  // 是否在轮播图播放
  "top": Boolean
  // 是否被置顶
})

// 把文章数据表横向切割，分为文章简介表和文章详情表
// 文件简介表的被访问的频率原高于文章详情表

module.exports = mongoose.model('Articles', articlesSchema)