var mongoose = require('mongoose')
var Schema = mongoose.Schema

labelsSchema = new Schema ({
  labelName: String
})

// 草稿箱文章简介
var draftsSchema = new Schema ({
  "articleId" : String,
  "userId" : String,
  "userName" : String,
  "userAvatarUrl" : String,
  "publishTime" : String,
  "articleVisit" : Number,
  "articleComment" : Number,
  "articleLove" : Number,
  "articleTitle" : String,
  "articleLabels" : [labelsSchema],
  "articleSummary" : String,
  "articleAvatarUrl": String,
  "loop": Boolean,
  "top": Boolean
})



module.exports = mongoose.model('Drafts', draftsSchema)

