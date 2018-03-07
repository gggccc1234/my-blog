var express = require('express');
var router = express.Router();
var Times = require('../models/time');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 时间标签
// 文章的时间分类
router.get('/list', function (req, res, next) {
  Times.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let temp = new Date()
      let newdate = `${temp.getFullYear()}-${temp.getMonth()+1}`
      let finaldate = (doc.length === 0 ? '' : doc[doc.length-1].name)
      let arr = doc.slice(0)
      if (newdate === finaldate) {
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      } else {
        // 数据库的时间标签当网站被访问时，会对比数据库中的时间标签和客户端事件来更新到最新的时间
        let newTime = new Times(
          {
            name: newdate,
            num: 0
          }
        )
        newTime.save(function (err1, doc1) {
          if (newdate === finaldate) {
            res.json({
              status: '2',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: doc.concat(doc1)
            })
          }
        })
      }
    }
  })
})

module.exports = router
