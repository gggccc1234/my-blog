var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 文章分类标签
var labelsSchema = new Schema ({
  "name": String,
  // 分类标签名字
  "num": Number
  // 该分类的文章数目
});

module.exports = mongoose.model('Labels', labelsSchema);