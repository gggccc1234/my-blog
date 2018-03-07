var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configsSchema = new Schema ({
  "articleLength": Number
});

module.exports = mongoose.model('Configs', configsSchema);