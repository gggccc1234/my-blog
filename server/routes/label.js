var express = require('express');
var router = express.Router();
var Labels = require('../models/label');
var Articles = require('../models/articlelist');
var Articledetails = require('../models/articledetail')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 文章分类标签管理
// 获取所有标签
router.get('/list', function(req, res, next) {
  Labels.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  });
});

// 新增加一个标签
router.get('/add', function(req, res, next) {
  let name = req.param("name");
  let newLabels = new Labels({
    name: name,
    num: 0
  });
  newLabels.save(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '添加成功',
        result: doc
      })
    }
  })
})

// 删除一个标签
router.get('/remove', function(req, res, next) {
  let name = req.param("name");
  Labels.remove({name: name}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 删除所有文章中的该标签
      Articles.update({}, {$pull: {"articleLabels": {labelName: name}}}, { multi: true }, function (err, doc) {
        // pull 删除
        // multi 删除所有
        if (err) {
          res.json({
            status: '2',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '删除成功',
            result: ''
          })
        }
      })
    }
  })
})

module.exports = router;