var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 草稿箱文章详情
var commentsSchema = new Schema({
  "articleId": String,
  "userId": String,
  "commentText": String,
  "good": Number,
  "bad": Number,
  "top": Boolean,
  "ptime": String,
  "floor": Number,
  "to": String,
  "from": String
})

var draftdetailsSchema = new Schema ({
  "articleId": String,
  "userId": String,
  "articleContent": String,
  "articleComments": [commentsSchema]
})

module.exports = mongoose.model('Draftdetails', draftdetailsSchema)