var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Articles = require('../models/articlelist');
var Articledetails = require('../models/articledetail');
var Drafts = require('../models/draftlist');
var Draftdetails = require('../models/draftdetail');
var Users = require('../models/users');
var Labels = require('../models/label');
var Times = require('../models/time');
var formidable = require('formidable');
var fs = require('fs');
var qiniu = require("qiniu");
var path = require('path');

// 连接七牛云的参数
var accessKey = 'GqjWvMObcHxF6SYBxVT37HfQOBqE0wu8TebVRBcS';
var secretKey = 'oi_t7jVQqMOaQoEKk5_o6TEFTYcX1stjYF4wPN7h';
qiniu.conf.ACCESS_KEY = 'GqjWvMObcHxF6SYBxVT37HfQOBqE0wu8TebVRBcS';
qiniu.conf.SECRET_KEY = 'oi_t7jVQqMOaQoEKk5_o6TEFTYcX1stjYF4wPN7h';
var bucket = 'chenyanfeng';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {scope: bucket}
var putPolicy = new qiniu.rs.PutPolicy(options);
var token=putPolicy.uploadToken(mac)
var key = ''
var loadFile = ''
var wailianyuming = 'http://ozil829qc.bkt.clouddn.com/'

// 连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog');

// 连接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.");
});

// 连接出错
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.");
});

// 无法连接
// 被数据库拒绝访问
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.");
});

// 获取指定文章简介列表
router.get("/", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let temp = JSON.parse(req.param("search"));
  let search = {};
  // 判断查找指标
  if (temp.tag) {
    // 按时间查找
    if (temp.tag === 'publishTime') {
      search = {
        publishTime: {$regex: temp.name}
      }
    } else if (temp.tag === 'articleLabel') {
      // 按分类标签查找
      search = {
        "articleLabels": {$elemMatch: {labelName: temp.name}}
      }
    } else if (temp.tag === 'text') {
      // 按标题和简介是否包含关键字查找
      search = {
        $or: [
          {articleTitle: {$regex: temp.name}},
          {articleSummary: {$regex: temp.name}}
        ]
      }
    } else if (temp.tag === 'loop') {
      // 按是否属于轮播图查找
      search = {
        loop: temp.name
      }
    }
  }
  let sort = JSON.parse(req.param('sort'));
  // sort 排序
  let skip = (page - 1) * pageSize;
  // skip 跳过前面的条目
  let articlesModel = Articles.find(search).skip(skip).limit(pageSize)
  // limit 限制返回的条目
  articlesModel.sort(sort);
  articlesModel.exec(function (err, doc) {
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

// 编辑文章
router.post("/edit", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // 设置响应头，允许所有域名的脚本访问此资源
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 限制访问该资源的方法
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-with");
  // 规定请求该资源的请求头必须携带的字段

  let form = new formidable.IncomingForm()
  // 创建formidable对象接受formData
  form.encoding = 'utf-8'
  // 规定字符编码
  form.keepExtentions = true
  form.maxFieldSize = 2 * 1024 * 1024
  // 规定文件大小
  form.parse(req, function (err, fileds, files) {
    if (err) {
      res.json({
        status: '2',
        msg: err.message
      })
    }
    let publish = fileds.publish
    // formidable的fileds包含所有表单字段
    // formidable的files包含所有表单文件
    let userName = fileds.userName
    let userAvatarUrl = fileds.userAvatarUrl
    let userId = fileds.userId
    let articleContent = fileds.articleContent
    let articleTitle = fileds.articleTitle
    let articleLabels = JSON.parse(fileds.articleLabels).arr
    let articleSummary = fileds.articleSummary
    let articleAvatarUrl = fileds.articleAvatarUrl
    let articleId = fileds.articleId
    let publishTime = fileds.publishTime
    let timeStamp = new Date()
    let num = Math.floor(Math.random()*10000) + ''
    if (articleId === '') {
      articleId = 'article' + timeStamp.getTime() + '-' + num
    }
    if (publishTime === '') {
      publishTime = `${timeStamp.getFullYear()}-${timeStamp.getMonth() + 1}-${timeStamp.getDate()}`
    }
    

    let detail = {
      articleId: articleId,
      userId: userId,
      articleContent: articleContent,
      articleComments: []
    };
    let list = {
      articleId: articleId,
      userId: userId,
      userName: userName,
      userAvatarUrl: userAvatarUrl,
      publishTime: publishTime,
      articleVisit: 0,
      articleComment: 0,
      articleLove: 0,
      articleTitle: articleTitle,
      articleLabels: articleLabels,
      articleSummary: articleSummary,
      articleAvatarUrl: articleAvatarUrl,
      top: false,
      loop: false
    };


    if (files.avatar !== undefined && files.avatar !== null && files.avatar !== '' && articleAvatarUrl === '') {
      // 有上传新头像
      let imgPath = files.avatar.path
      let data = fs.readFileSync(imgPath)
      // 读取二进制图片文件
      let extname = path.extname(files.avatar.name)
      // 获取后缀名
      // 得到的后缀名带点
      let imgName = `articleAvatarUrl_${articleId}_${publishTime}${extname}`
      key = imgName;
      let dir = __dirname
      dir = dir.substring(2, dir.length - 6)
      loadFile = dir + key
      fs.writeFileSync(imgName, data, function (err) {})  
      // 写入为普通图片格式文件
      fs.unlink(imgPath, function(err) {})     
      // 删除二进制图片文件
      var config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z0;
      var formUploader = new qiniu.form_up.FormUploader(config);
      var putExtra = new qiniu.form_up.PutExtra();
      formUploader.putFile(token, key, loadFile, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
          res.json({
            status: '6',
            msg: '图片上传出错'
          })
        }
        if (respInfo.statusCode == 200) {
          list.articleAvatarUrl = wailianyuming + imgName
          console.log(list.articleAvatarUrl)
          // 上传成功，图片链接更新为七牛的外链
          if (publish === '0') {
            // 发表文章
            let newArticledetail = new Articledetails(detail)
            newArticledetail.save(function (err, doc) {
              if (err) {
                res.json({
                  status: '2',
                  msg: err.message,
                  result: ''
                })
              }
            })
            // 更新文章简介
            let newArticles = new Articles(list)
            newArticles.save(function (err, doc) {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ''
                })
              } else {
                fs.unlink(loadFile, function (err) {})
              }
            })
            // 更新文章分类标签
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
            let tptime = publishTime.substring(0, 7)
            // 更新文章时间标签
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
              } else {
                res.json({
                  status: '0',
                  msg: '发表成功'
                })
              }
            })
          } else if (publish === '1'){
            // 更新草稿
            let newDraftdetail = new Draftdetails(detail)
            // 更新草稿详情
            newDraftdetail.save(function (err, doc) {
              if (err) {
                res.json({
                  status: '2',
                  msg: err.message,
                  result: ''
                })
              }
            })
            // 更新草稿简介
            let newDrafts = new Drafts(list)
            newDrafts.save(function (err, doc) {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ''
                })
              } else {
                fs.unlink(loadFile, function (err) {})
                res.json({
                  status: '0',
                  msg: '发表成功'
                })
              }
            }) 
          } else if (publish === '2'){
            // 更新文章
            console.log(5113513)
            Articles.update({
              articleId: articleId
            }, function (err, doc) {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ''
                })
              } else {
                doc.articleLabels.forEach((item) => {
                  // 旧的文章的分类标签减一
                  Labels.update({
                    name: item.labelName
                  }, {$inc: {
                    num: -1
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
              }
            })
            Articledetails.update({
              // 更新文章详情
              articleId: articleId
            }, {
              $set: detail
            }, function (err, doc) {
              if (err) {
                res.json({
                  status: '2',
                  msg: err.message,
                  result: ''
                })
              }
            })
            // 更新文章简介
            Articles.update({
              articleId: articleId
            }, {
              $set: list
            }, function (err, doc) {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ''
                })
              } else {
                fs.unlink(loadFile, function (err) {})
                // 更新完毕，删除图片
              }
            })
            articleLabels.forEach((item) => {
              // 更新新的文章分类标签
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
          }
        } else {
          res.json({
            status: '7',
            msg: '图片上传出错'
          })
        }
      })
    } else {
      if (publish === '2'){
        // 无图片更新
        Articles.findOne({
          articleId: articleId
        }, function (err, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            // 旧的文章分类标签减一
            doc.articleLabels.forEach((item) => {
              Labels.update({
                name: item.labelName
              }, {$inc: {
                num: -1
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
          }
        })
        Articledetails.update({
          // 更新文章详情
          articleId: articleId
        }, {
          $set: detail
        }, function (err, doc) {
          if (err) {
            res.json({
              status: '2',
              msg: err.message,
              result: ''
            })
          }
        })
        // 更新文章简介
        Articles.update({
          articleId: articleId
        }, {
          $set: list
        }, function (err, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } 
        })
        // 更新新的文章标签
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
      }
    }
  })
})

// 获取文章详情
router.get("/content", function (req, res, next) {
  let articleId = req.param("articleId")
  Articledetails.findOne({"articleId": articleId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      }
    }
  })
})

// 查看文章
// 文章的浏览数加1
router.get("/visit", function (req, res, next) {
  let articleId = req.param("articleId")
  Articles.update({articleId: articleId}, {$inc: {articleVisit: 1}}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})

// 评论
router.post("/comment", function (req, res, next) {
  let articleId = req.body.articleId
  let userId = req.body.userId
  let commentText = req.body.commentText
  let userName = req.body.userName
  let userAvatarUrl = req.body.userAvatarUrl
  let good = 0
  let bad = 0
  let top = false
  let newdate = new Date()
  let ptime = `${newdate.getFullYear()}-${newdate.getMonth()+1}-${newdate.getDate()}-${newdate.getHours()}-${newdate.getSeconds()}`
  let floor = parseInt(req.body.floor)

  let comment = {
    articleId: articleId,
    userId: userId,
    commentText: commentText,
    good: good,
    bad: bad,
    top: top,
    userName: userName,
    userAvatarUrl: userAvatarUrl,
    ptime: ptime,
    floor: floor,
    to: String,
    from: String
  }
  Articledetails.update({articleId: articleId}, {$push: {articleComments: comment}}, function (err, doc) {
    // 向文章添加评论
    if (err) {
      res.json({
        status: '3',
        msg: err.message,
        result: ''
      })
    } else {
      Articles.update({articleId: articleId}, {$inc: {articleComment: 1}}, function (err, doc) {
        // 文章评论数目加1
        if (err) {
          res.json({
            status: '2',
            msg: err.message,
            result: ''
          })
        } else {
          let temp = {
            articleId: articleId,
            floor: floor
          }
          Users.update({userId: userId}, {$push: {userComments: temp}}, function (err, doc) {
            // 向用户插入评论
            if (err) {
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                msg: '评论成功',
                result: comment
              })
            }
          })
        }
      })
    }
  })
})

// 删除评论
router.get('/deletecomment', function (req, res, next) {
  let articleId = req.param('articleId')
  let userId = req.param('userId')
  let floor = parseInt(req.param('floor'))
  // 删除文章部分评论
  Articledetails.update({
    articleId: articleId
  }, {
    $pull: {
      "articleComments": {
        floor: floor
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 删除用户部分评论
      Users.update({
        userId: userId 
      }, {
        $pull: {
          "userComments": {
            articleId: articleId,
            floor: floor
          }
        }
      }, function (err2, doc2) {
        if (err2) {
          res.json({
            status: '3',
            msg: err2.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})

// 删除文章
router.get('/deletearticle', function (req, res, next) {
  let articleId = req.param('articleId')
  Articles.findOne({
    articleId: articleId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 文章时间标签数目减一
      Times.update({
        name: doc.publishTime.substring(0, 7)
      }, {
        $inc: {
          num: -1
        }
      }, function (err1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        }
      })
      doc.articleLabels.forEach((item) => {
        // 文章分类标签数目减一
        Labels.update({
          name: item.labelName
        }, {
          $inc: {
            num: -1
          }
        }, function (err1) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          }
        })
      })
      // 删除文章简介
      Articles.remove({
        articleId: articleId
      }, function (err1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        }
      })
    }
  })
  // 删除文章正文
  Articledetails.remove({
    articleId: articleId
  }, function (err) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

// 设置文章为轮播图
router.get('/loop', function (req, res, next) {
  let articleId = req.param('articleId')
  let loop = req.param('loop')
  Articles.update({
    articleId: articleId
  }, {
    $set: {
      loop: loop
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})

module.exports = router;

