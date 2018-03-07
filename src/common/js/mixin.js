import {mapMutations, mapGetters} from 'vuex'
import axios from 'axios'
import {decodeComment} from '@/common/js/util'
import xss from 'xss'

// 登录mixin
export const loginMixin = {
  data () {
    return {
      textName: '登录',
      timer: null
    }
  },
  created () {
    if (this.loginSuccess) {
      this.textName = '退出'
    } else {
      this.textName = '登录'
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
      // 当前用户的详细资料
      'isLogin',
      // 是否打开登陆框
      'loginSuccess'
      // 是否登陆成功
    ])
  },
  methods: {
    // 登录或退出
    isLoOrRe () {
      if (!this.loginSuccess) {
        this.isLo()
      } else {
        this.setCurrentUser({})
        this.setLoginSuccess(false)
        this.isFa()
      }
    },
    // 切换登陆框状态
    isLo () {
      this.setIsLoginToggle()
    },
    // 打开登陆框
    isOp () {
      this.moveTop()
      this.setIsLogin(true)
    },
    // 关闭的登陆框
    isFa () {
      this.setIsLogin(false)
    },
    // 回到顶部
    fn () {
      var oTop = document.body.scrollTop || document.documentElement.scrollTop
      // document.body.scrollTop 兼容 webkit 内核
      // document.documentElement.scrollTop 兼容其它浏览器
      if (oTop > 0) {
        document.body.scrollTop = document.documentElement.scrollTop = oTop - 50
        this.timer = requestAnimationFrame(this.fn)
        // requestAnimationFrame 动画函数 相当于升级版的 setInterval
      } else {
        cancelAnimationFrame(this.timer)
        // 停止动画函数
      }
    },
    // 回到顶部
    moveTop () {
      cancelAnimationFrame(this.timer)
      this.timer = requestAnimationFrame(this.fn)
    },
    ...mapMutations({
      setCurrentUser: 'SET_CURRENT_USER',
      setLoginSuccess: 'SET_LOGIN_SUCCESS',
      setIsLogin: 'SET_IS_LOGIN',
      setIsLoginToggle: 'SET_IS_LOGIN_TOGGLE'
    })
  },
  watch: {
    loginSuccess (newVal) {
      if (newVal) {
        this.textName = '退出'
      } else {
        this.textName = '登录'
      }
    }
  }
}

// 跳转到当前文章正文详情页
export const turnArticleMixin = {
  computed: {
    ...mapGetters([
      'currentArticle'
    ])
  },
  methods: {
    // 通过this.$router跳转
    turnArticle () {
      this.setCurrentArticle(this.article)
      this.addVisit()
      this.$router.push(`/mainpage/article/${this.currentArticle.articleId}`)
    },
    // 当前文章被访问数加一
    addVisit () {
      let param = {
        articleId: this.currentArticle.articleId
      }
      let url = '/articlelist/visit'
      axios.get(url, {
        params: param
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          this.setArticleVisit(this.currentArticle.articleVisit)
        } else {
          console.log(res.msg)
        }
      })
    },
    ...mapMutations({
      setCurrentArticle: 'SET_CURRENT_ARTICLE',
      setArticleVisit: 'SET_ARTICLE_VISIT'
    })
  }
}

// 获取文章详情
export const getDetailMixin = {
  data () {
    return {
      articleDetail: {}
    }
  },
  methods: {
    getArticleDetail (articleId) {
      let param = {
        articleId: articleId
      }
      axios.get('/articlelist/content', {
        params: param
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          this.articleDetail = res.result
          // this.articleDetail.articleContent = decodeURIComponent(this.articleDetail.articleContent)
          this.articleDetail.articleComments.forEach((item) => {
            decodeComment(item)
          })
          return this.articleDetail
        } else {
          alert('文章不见了')
        }
      })
    },
    returnArticleDetail () {
      return this.articleDetail
    }
  }
}

// 收藏当前文章
export const collectMixin = {
  computed: {
    ...mapGetters([
      'currentArticle',
      'currentUser'
    ])
  },
  methods: {
    collect (articleId, userId) {
      let param = {
        articleId: articleId,
        userId: userId
      }
      axios.get('/users/collect', {
        params: param
      }).then((response) => {
        let ret = response.data
        if (ret.status === '0') {
          let temp = this.currentArticle.articleLove
          if (ret.msg === 'add') {
            temp++
          } else {
            temp--
          }
          this.setArticleLove(temp)
        }
      })
    },
    ...mapMutations({
      setArticleLove: 'SET_ARTICLE_LOVE',
      setCurrentUser: 'SET_CURRENT_USER',
      setCheckUser: 'SET_CHECK_USER'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      searchText: ''
      // 搜索内容
    }
  },
  computed: {
    ...mapGetters([
      'page',
      // 第几页
      'search',
      // 搜索的参数
      'pageSize',
      // 每页的数目
      'sort'
      // 排序的参数
    ])
  },
  methods: {
    showSearch () {
      if (this.searchText !== '') {
        // 搜索框有内容
        this.setPage(1)
        let search = {
          tag: 'text',
          name: xss(this.searchText)
          // 防止xss攻击
        }
        this.setSearch(search)
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          search: this.search,
          sort: this.sort
        }
        let url = '/articlelist'
        // 搜索文章内容
        // 更新当前文章列表
        axios.get(url, {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.setArticleLists(res.result)
          } else {
            console.log(res.msg)
          }
        })
      }
    },
    ...mapMutations({
      setPage: 'SET_PAGE',
      setArticleLists: 'SET_ARTICLE_LISTS',
      setSearch: 'SET_SEARCH'
    })
  }
}
