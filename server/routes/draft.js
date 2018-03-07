var express = require('express');
var router = express.Router();
var Articles = require('../models/articlelist');
var Articledetails = require('../models/articledetail');
var Drafts = require('../models/draftlist');
var Draftdetails = require('../models/draftdetail');
var Times = require('../models/time');
var Labels = require('../models/label')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 获取所有草稿
router.get("/list", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let search = JSON.parse(req.param("search"));
  let sort = JSON.parse(req.param('sort'));
  let skip = (page - 1) * pageSize;
  let draftsModel = Drafts.find(search).skip(skip).limit(pageSize)
  draftsModel.sort(sort);
  draftsModel.exec(function (err, doc) {
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
  })
});

// 发布草稿
router.get("/publish", function(req, res, next) {
  let operate = req.param('operate')
  let timeStamp = new Date()
  let num = Math.floor(Math.random()*10000) + ''
  let publishTime = `${timeStamp.getFullYear()}-${timeStamp.getMonth() + 1}-${timeStamp.getDate()}`
  let currentDraft = JSON.parse(req.param("currentDraft"))
  let articleId = currentDraft.articleId
  let articleLabels = currentDraft.articleLabels
  currentDraft.publishTime = publishTime
  let newArticles = new Articles(currentDraft)
  if (operate === '0' || operate === 0) {
    // 把草稿存入文章库
    newArticles.save(function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        });
      }
    })
    Draftdetails.findOne({
      articleId: articleId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '4',
          msg: err.message
        });
      } else {
        let newArticleDetails = new Articledetails(doc)
        newArticleDetails.save(function (err, doc) {
          if (err) {
            res.json({
              status: '3',
              msg: err.message
            });
          }
        })
      }
    })
    // 修改文章分类标签的数目
    articleLabels.forEach((item) => {
      Labels.update({
        name: item.labelName
      }, {$inc: {
        num: 1
      }}, function (err) {
        if (err) {
          res.json({
            status: '8',
            msg: err.message,
            result: ''
          })
        }
      })
    })
    // 修改文章时间标签的数目
    let tptime = publishTime.substring(0, 7)
    Times.update({
      name: tptime
    }, {
      $inc: {
        num: 1
      }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '9',
          msg: err.message,
          result: ''
        })
      }
    })
  }
  // 发布成功，删除草稿箱里的原草稿文章简介
  Drafts.remove({
    articleId: articleId
  }).then(function (err, doc) {
    if (err) {
      res.json({
        status: '2',
        msg: err.message
      });
    }
  })
  // 发布成功，删除草稿箱里的原草稿文章详情
  Draftdetails.remove({
    articleId: articleId
  }).then(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    }
  })
  res.json({
    status: '0',
    msg: '',
    result: 'suc'
  })
})

module.exports = router;