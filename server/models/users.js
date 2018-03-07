var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usercommentsSchema = new Schema ({
  "articleId": String,
  // 评论所在的文章id
  "floor": Number
  // 评论所在的文章楼层
})

var lovearticlesSchema = new Schema ({
  "articleId": String
  // 用户收藏的文章id
})

var usersSchema = new Schema ({
  "userId": String,
  // 用户id
  "userName" : String,
  // 用户名
  "userPassword" : String,
  // 用户密码
  "userAvatarUrl" : String,
  // 用户头像
  "userEmail" : String,
  // 用户邮箱
  "userLink" : String,
  // 用户博客链接
  "userGithub" : String,
  // 用户GitHub地址
  "userDescription" : String,
  // 用户的签名
  "userLoveArticles": [lovearticlesSchema],
  // 用户收藏文章的列表
  "userComments": [usercommentsSchema],
  // 用户的评论列表
  "userRole": String
  // 用户的角色
});

module.exports = mongoose.model('Users', usersSchema);