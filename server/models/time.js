var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 文章时间标签
var timesSchema = new Schema ({
  // 时间日期
  "name": String,
  // 属于当前时间日期内发表的文章数目
  "num": Number
});

module.exports = mongoose.model('Times', timesSchema);