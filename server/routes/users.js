var express = require('express');
var router = express.Router();
var Users = require('./../models/users');
var Articles = require('../models/articlelist');
var Articledetails = require('../models/articledetail')
var formidable = require('formidable');
var fs = require('fs');
var qiniu = require('qiniu');
var path = require('path')
var encrypt = require('./../models/md5');

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


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 初始化页面是检测当前访客是否有有效session在服务器中
// 有则表示访客处于登录状态中，返回登陆状态
router.post('/main', function(req, res, next) {
  if (req.session.sign) {
    res.json({
      status: 0,
      msg: '',
      result: req.session.userMsg
    })
  } else {
    res.json({
      status: 1,
      msg: '',
      result: ''
    })
  }
})

// 用户登录
router.post('/list', function(req, res, next) {
  let param = {
    userName: req.body.username,
    userPassword: encrypt(req.body.password)
  }
  Users.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: '2',
        msg: err.message
      })
    } else {
      if (doc) {
        // 登陆成功
        // 不返回用户密码字段
        // 写入session
        doc.userPassword = null
        req.session.sign = true
        req.session.userMsg = doc
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      } else {
        res.json({
          status: '1',
          msg: '账户不存在或密码错误'
        })
      }
    }
  })
});

// 用户注册
// encrypt 函数用于给密码解密
router.post('/register', function (req, res, next) {
  let userName = req.body.username
  let timeStamp = new Date()
  let num = Math.floor(Math.random()*10000) + ''
  let userId = 'user' + timeStamp.getTime() + '-' + num
  // 先检查当前用户名是否已经存在
  Users.findOne({"userName": userName}, function (err, doc) {
    if (err) {
      res.json({
        status: '3',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '2',
          msg: '用户名已经存在',
          result: ''
        })
      } else {
        // 注册成功，用户数据存入数据库
        let newUser = new Users({
          userId: userId,
          userName: userName,
          userPassword: encrypt(req.body.password),
          userAvatarUrl: '',
          userEmail: req.body.useremail,
          userLink: '',
          userGithub: '',
          userDescription: '',
          userLoveArticles: [],
          userComments: [],
          userRole: 'client'
        })
        newUser.save(function (err, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '注册成功',
              result: ''
            })
          }
        })
      }
    }
  })
})

// 编辑用户信息
router.post("/edit", function (req, res, next) {
  // 修改响应头信息
  res.header("Access-Control-Allow-Origin", "*");
  // 允许所有域名的脚本访问该资源，实现跨域访问
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 域名的脚本访问该资源的方法
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-with");
  // 域名的脚本访问该资源请求头必带的信息

  let form = new formidable.IncomingForm()
  // 创建一个formidable对象
  form.encoding = 'utf-8'
  // 字符编码
  form.maxFieldSize = 2 * 1024 * 1024
  // 限制表格传输文件最大2M
  form.parse(req, function (err, fileds, files) {
    if (err) {
      res.json({
        status: '2',
        msg: err.message
      })
    }
    // formidable.fileds 里面有所有的表单字段
    // formidable.files 里面有所有的表单文件
    let imgPath = files.avatar.path
    let data = fs.readFileSync(imgPath)
    // 读取图片文件
    let userId = fileds.userId
    let userName = fileds.userName
    let userEmail = fileds.userEmail
    let userLink = fileds.userLink
    let userGithub = fileds.userGithub
    let userDescription = fileds.userDescription
    let userAvatarUrl = fileds.userAvatarUrl
    let timeStamp = new Date()
    let num = Math.floor(Math.random()*10000) + ''
    let avatarId = timeStamp.getTime() + '-' + num
    let extname = path.extname(files.avatar.name)
    // 获取文件后缀名 path.extname()
    // 后缀名中带有点 .jpg  .png
    let imgName = `userAvatarUrl_${userId}_${avatarId}${extname}`
    key = imgName;
    loadFile = __dirname.slice(0, -6) + key
    // __dirname 是.../server/routes
    // 缓存的图片在.../server处，使用slice切割
    fs.writeFileSync(imgName, data, function (err) {})
    // 同步写入缓存区的二进制的图片文件流
    // 不用异步操作是因为后面的操作要是使用到该图片
    fs.unlink(imgPath, function (err) {})
    // 写入完毕删除二进制图片文件 unlink
    // 因为上传到七牛要上传 .jpg或.png的普通格式，所以要做转换
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    // 上传图片到七牛
    formUploader.putFile(token, key, loadFile, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        res.json({
          status: '6',
          msg: '图片上传出错'
        })
      }
      if (respInfo.statusCode == 200) {
        // 上传成功 userAvatarUrl 改为七牛云的外链
        userAvatarUrl = wailianyuming + imgName
        var conditions = {userName: userName}
        var update = {$set: {
          userId: userId,
          userName: userName,
          userAvatarUrl: userAvatarUrl,
          userEmail: userEmail,
          userLink: userLink,
          userGithub: userGithub,
          userDescription: userDescription
        }}
        var options = {}
        Users.update(conditions, update, options, function (err, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            fs.unlink(loadFile, function (err) {})
            // 删除本地的 .jpg和.png文件
            doc.userPassword = null
            // 为了保证安全，再返回前清空用户密码字段
            res.json({
              status: '0',
              msg: '修改信息成功',
              result: doc
            })
          }
        })
      } else {
        res.json({
          status: '7',
          msg: '图片上传出错'
        })
      }
    })
  })
})

// 收藏文章
router.get("/collect", function (req, res, next) {
  let articleId = req.param("articleId");
  let userId = req.param("userId");
  // elemMatch 匹配当前文章编号是否已经存在与当前用户的文章收藏列表里
  Users.findOne({userId: userId, "userLoveArticles": { $elemMatch: {articleId: articleId}}}, function (err, doc) {
    if (err) {
      res.json({
        status: '4',
        msg: err.message,
        result: ''
      })
    } else if (!doc){
      // 当前用户没收藏当前文章，添加当前文章到当前用户的文章收藏列表里
      Users.update({userId: userId}, {$push: {"userLoveArticles": {articleId: articleId}}}, function (err1, doc1) {
        if (err1) {
          res.json({
            status: '3',
            msg: err1.message,
            result: ''
          })
        } else {
          // 更新当前文章被收藏数目
          // inc: {a: 1} a字段加1
          Articles.update({articleId: articleId}, {$inc: {articleLove: 1}}, function (err2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                msg: 'add',
                result: '',
              })
            }
          });
        }
      })
    } else {
      // 当前用户已经收藏当前文章，删除当前文章到当前用户的文章收藏列表里
      Users.update({userId: userId}, {$pull: {"userLoveArticles": {articleId: articleId}}}, function (err1, doc1) {
        if (err1) {
          res.json({
            status: '3',
            msg: err1.message,
            result: ''
          })
        } else {
          // 更新当前文章被收藏数目
          // inc: {a: -1} a字段加-1
          Articles.update({articleId: articleId}, {$inc: {articleLove: -1}}, function (err2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                msg: 'sub',
                result: '',
              })
            }
          });
        }
      })
    }
  })
})

// 给评论点赞
router.get('/good', function (req, res, next) {
  let articleId = req.param("articleId")
  let userId = req.param("userId")
  let floor = parseInt(req.param("floor"))
  let good = parseInt(req.param("good"))
  good++
  Articledetails.findOne({articleId: articleId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      for (let i = 0; i < doc.articleComments.length; i++) {
        if (doc.articleComments[i].floor === floor) {
          doc.articleComments[i].good = good
          doc.markModified('good')
          // markModified是提示数据库good字段被改变了
          doc.save(function (err1) {
            if (err1) {
              res.json({
                status: 4,
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
        }
      }
    }
  })
})

// 给评论点踩
router.get('/bad', function (req, res, next) {
  let articleId = req.param("articleId")
  let userId = req.param("userId")
  let floor = parseInt(req.param("floor"))
  let bad = parseInt(req.param("bad"))
  bad++
  Articledetails.findOne({articleId: articleId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      for (let i = 0; i < doc.articleComments.length; i++) {
        if (doc.articleComments[i].floor === floor) {
          doc.articleComments[i].bad = bad
          doc.markModified('bad')
          // markModified是提示数据库bad字段被改变了
          doc.save(function (err1) {
            if (err1) {
              res.json({
                status: 4,
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
        }
      }
    }
  })
})

// 返回指定用户列表
router.get("/all", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let search = JSON.parse(req.param("search"));
  let sort = JSON.parse(req.param('sort'));
  let skip = (page - 1) * pageSize;
  let usersModel = Users.find(search).skip(skip).limit(pageSize)
  // skip 跳过多少条数据
  // limit 限制返回多少数据
  usersModel.sort(sort);
  usersModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      for (let i = 0; i < doc.length; i++) {
        doc[i].userPassword = null
        // 不返回用户密码字段，提高安全性
      }
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  })
})

// 获取用户评论详情
router.post("/commentdetail", function (req, res, next) {
  let userComments = req.body.userComments
  let userId = req.body.userId
  // 根据相关的用户评论的文章号和相应的评论的标号
  // 找出用户评论
  Articledetails.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      let comments = []
      let UCS = []
      let flag = 0
      // 没有评论找到对应的文章，说明文章已经被删除，顺便删除该条评论
      // 删除文章使用的是懒删除，不会删除该篇文章相关的收藏记录和评论，当相关记录被读取时顺便删除
      userComments.forEach((item1) => {
        flag = 0
        for (let i = 0; i < doc.length; i++) {
          let item = doc[i]
          if (item.articleId === item1.articleId) {
            item.articleComments.forEach((item2) => {
              if (item2.floor === item1.floor) {
                comments.push(item2)
                UCS.push(item1)
                flag = 1
              }
            })
          }
          if (flag === 1) {
            break
          }
        }
      })
      // 删除记录成功时更新数据库记录
      Users.update({
        userId: userId
      }, {
        $set: {
          userComments: UCS
        }
      }, function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: comments
          });
        }
      })
    }
  })
})

// 请求用户收藏文章列表
router.post("/collectlist", function (req, res, next) {
  let userId = req.body.userId
  // 用户表的收藏列表的字段是该篇文章的唯一标识符
  // 从文章列表中获取文章简介
  Users.findOne({userId: userId}, function (err2, doc2) {
    if (err2) {
      res.json({
        status: '3',
        msg: err2.message
      })
    } else {
      let userLoveArticles = []
      doc2.userLoveArticles.forEach((aid) => {
        userLoveArticles.push(aid.articleId)
      })
      console.log(userLoveArticles)
      Articles.find({
        articleId: {
          $in: userLoveArticles
        }
      }, function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          });
        } else {
          console.log(doc)
          console.log(userLoveArticles)
          // 没有找到对应的文章，说明文章已经被删除，顺便删除该条记录
          // 删除文章使用的是懒删除，不会删除该篇文章相关的收藏记录和评论，当相关记录被读取时顺便删除
          userLoveArticles = userLoveArticles.filter((item) => {
            let flag = false
            doc.forEach((item1) => {
              if (item1.articleId === item) {
                flag = true
              }
            })
            if (flag) {
              return true
            } else {
              return false
            }
          })
          console.log(doc)
          console.log(userLoveArticles)
          // 删除记录成功时更新数据库记录
          let ULA = []
          userLoveArticles.forEach((item) => {
            let temp = {
              articleId: item
            }
            ULA.push(temp)
          })
          Users.update({
            userId: userId
          }, {
            $set: {
              userLoveArticles: ULA
            }
          }, function (err1, doc1) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                result: doc
              });
            }
          })
        }
      })
    }
  })
})

// 删除用户
router.get("/delete", function (req, res, next) {
  let userId = req.param('userId')
  Users.remove({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      });
    }
  })
})

// 管理员认证
router.post("/admin", function (req, res, next) {
  let userId = req.body.userId
  Users.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      console.log(doc.userRole)
      console.log(doc.userRole === '7293953541901')
      if (doc.userRole === '7293953541901') {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      } else {
        res.json({
          status: '3',
          msg: '',
          result: ''
        })
      }
    }
  })
})

module.exports = router;
