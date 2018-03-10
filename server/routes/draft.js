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
router.post("/publish", function(req, res, next) {
  let operate = req.body.operate
  let timeStamp = new Date()
  let num = Math.floor(Math.random()*10000) + ''
  let publishTime = `${timeStamp.getFullYear()}-${timeStamp.getMonth() + 1}-${timeStamp.getDate()}`
  let currentDraft = req.body.currentDraft
  let articleId = currentDraft.articleId
  let articleLabels = currentDraft.articleLabels
  currentDraft.publishTime = publishTime
  // 利用对象生成一个新条目
  let newArticles = new Articles(currentDraft)
  if (operate === '0' || operate === 0) {
    // 把草稿简介存入文章简介库
    newArticles.save(function (err) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        });
      } else {
        // 把草稿详情存入文章详情库
        Draftdetails.findOne({
          articleId: articleId
        }, function (err1, doc1) {
          if (err1) {
            res.json({
              status: '4',
              msg: err1.message
            });
          } else {
            Articledetails.create({
              articleId: doc1.articleId,
              userId: doc1.userId,
              articleContent: doc1.articleContent,
              articleComments: doc1.articleComments
            }, function (err2) {
              if (err2) {
                res.json({
                  status: '3',
                  msg: err2.message
                });
              } else {
                // 修改文章时间标签的数目
                let tptime = publishTime.substring(0, 7)
                if (tptime[tptime.length - 1] === '-') {
                  tptime = tptime.substring(0, 6)
                }
                Times.update({
                  name: tptime
                }, {
                  $inc: {
                    num: 1
                  }
                }, function (err4, doc4) {
                  if (err4) {
                    res.json({
                      status: '9',
                      msg: err4.message,
                      result: ''
                    })
                  } else {
                    Drafts.remove({
                      articleId: articleId
                    }).then(function (doc5, err5) {
                      if (err5) {
                        res.json({
                          status: '2',
                          msg: err5.message
                        });
                      } else {
                        Draftdetails.remove({
                          articleId: articleId
                        }).then(function (doc6, err6) {
                          if (err6) {
                            res.json({
                              status: '1',
                              msg: err6.message
                            });
                          } else {
                            // 修改文章分类标签的数目
                            articleLabels.forEach((item, index, array) => {
                              Labels.update({
                                name: item.labelName
                              }, {$inc: {
                                num: 1
                              }}, function (err3) {
                                if (err3) {
                                  res.json({
                                    status: '8',
                                    msg: err3.message,
                                    result: ''
                                  })
                                } else if (index === array.length - 1) {
                                  res.json({
                                    status: '0',
                                    msg: '',
                                    result: 'suc'
                                  })
                                }
                              })
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    Drafts.remove({
      articleId: articleId
    }).then(function (doc5, err5) {
      if (err5) {
        res.json({
          status: '2',
          msg: err5.message
        });
      } else {
        Draftdetails.remove({
          articleId: articleId
        }).then(function (doc6, err6) {
          if (err6) {
            res.json({
              status: '1',
              msg: err6.message
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    })
  }
})

module.exports = router;