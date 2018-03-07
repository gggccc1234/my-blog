// 判断是否是合法电子邮件格式
export const isEmail = function (str) {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)$/
  return reg.test(str)
}

// 判断是否是合法连接格式
export const isLink = function (str) {
  var reg = /^([a-zA-Z0-9_-]+.)+([a-zA-Z0-9_-]+)$/
  return reg.test(str)
}

// 判断是否是合法图片格式
export const isPicture = function (str) {
  var reg = /^(?:image\/bmp|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff)$/i
  return reg.test(str)
}

// 判断是否是合法密码格式
export const isPassword = function (str) {
  var reg = /^[0-9a-zA-Z]{6,16}$/
  return reg.test(str)
}

// 对article解码
export const decodeArticle = function (article) {
  article.articleTitle = unescape(article.articleTitle)
  article.articleSummary = unescape(article.articleSummary)
  article.userName = unescape(article.userName)
}

// 对user解码
export const decodeUser = function (user) {
  user.userName = unescape(user.userName)
  user.userDescription = unescape(user.userDescription)
  user.userEmail = decodeURIComponent(user.userEmail)
  user.userLink = decodeURIComponent(user.userLink)
  user.userGithub = decodeURIComponent(user.userGithub)
}

// 对comment解码
export const decodeComment = function (comment) {
  comment.commentText = decodeURIComponent(comment.commentText)
  comment.userName = unescape(comment.userName)
  comment.userAvatarUrl = decodeURIComponent(comment.userAvatarUrl)
}
