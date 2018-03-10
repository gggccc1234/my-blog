<template>
  <div class="article">
    <div class="article-content">
      <div class="article-header">
        <div class="articleTitle">{{currentArticle.articleTitle}}</div>
      </div>
      <div class="next-header">
        <!-- 作者名字 -->
        <div class="userName-wrapper">
          <img src="./user.svg" alt="" class="article-img" width="20px" height="20px">
          <div class="article-text">{{currentArticle.userName}}</div>
        </div>
        <!-- 文章标签列表 -->
        <div class="articleLabel-wrapper">
          <img src="./label.svg" alt="" class="article-img" width="20px" height="20px">
          <div class="article-text">
            <ul v-for="item in currentArticle.articleLabels" style="display: inline-block">
              <li class="label-item">{{item.labelName}}</li>
            </ul>
          </div>
        </div>
        <!-- 发表时间 -->
        <div class="publishTime-wrapper">
          <img src="./time.svg" alt="" class="article-img" width="20px" height="20px">
          <div class="article-text">发表于：{{currentArticle.publishTime}}</div>
        </div>
        <!-- 浏览数量 -->
        <div class="articleVisit-wrapper">
          <img src="./eye.svg" alt="" class="article-img" width="20px" height="20px">
          <div class="article-text">{{currentArticle.articleVisit}}浏览</div>
        </div>
        <!-- 评论数量 -->
        <div class="articleComment-wrapper">
          <img src="./message.svg" alt="" class="article-img" width="20px" height="20px">
          <div class="article-text">{{currentArticle.articleComment}}评论</div>
        </div>
      </div>
      <div class="return-wrapper">
        <a class="returnP" @click="turnmainpage()">
          <img src="./back.svg" width="30px" class="returnicon">
          <span class="returntext">首页</span>
        </a>
      </div>
      <div class="line"></div>
      <!-- 文章正文 -->
      <div class="articleContent">
        <div id="articleCont" class="articleCont"></div>
      </div>
      <div class="line"></div>
      <div class="paper" style="display: none">
        <span class="prevpaper">上篇</span>
        <span class="nextpaper">下篇</span>
      </div>
      <div class="line"></div>
      <!-- 文章底部 -->
      <div class="article-footer">
        <!-- 收藏文章 -->
        <div class="articleLove" @click="collectArticle()">
          <img src="./heart-in-love.svg" alt="" class="article-img" width="20px" height="40px">
          <div class="article-text">{{currentArticle.articleLove}}</div>
        </div>
        <div class="or-wrapper">
          <div class="or">or</div>
        </div>
        <!-- 分享 -->
        <div class="articleShare">
          <img src="./share.svg" alt="" class="article-img" width="20px" height="40px">
          <div class="article-text">0</div>
        </div>
      </div>
    </div>
    <!-- 文章评论 -->
    <comment :articleComments="articleDetail.articleComments"></comment>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Article.styl'
</style>

<script type="text/ecmascript-6">
// 文章详情页组件
  import {mapGetters, mapMutations} from 'vuex'
  import Comment from '@/components/Comment/Comment'
  import {loginMixin, getDetailMixin, collectMixin} from '@/common/js/mixin'
  import $ from 'jquery'

  export default {
    mixins: [loginMixin, getDetailMixin, collectMixin],
    data () {
      return {
        articleId: -1,
        // 当前文章id
        editor2: null
      }
    },
    created () {
      if (!this.currentArticle.articleId) {
        this.$router.push('/mainpage')
      }
      this.articleId = this.currentArticle.articleId
      this.getArticleDetail(this.articleId)
    },
    mounted () {
      this.moveTop()
    },
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    methods: {
      // 收藏文章
      collectArticle () {
        if (!this.loginSuccess) {
          alert('您还没有登录')
          this.isOp()
          return null
        }
        this.collect(this.currentArticle.articleId, this.currentUser.userId)
      },
      turnmainpage () {
        this.$router.push('/mainpage')
      },
      setArticleContent (obj) {
        document.getElementById('articleCont').innerHTML = obj.articleContent
        $('#articleCont blockquote').css({
          'background-color': '#a1d0dd',
          'line-height': '22px',
          'margin': '5px 6px',
          'border-radius': '5px',
          'padding': '10px 15px',
          'text-indent': '2em',
          'max-height': '500px',
          'overflow': 'auto',
          'font-size': '16px',
          'border': '1px solid #fff'
        })
        $('#articleCont p').css({
          'padding': '5px 15px',
          'line-height': '22px',
          'font-size': '16px',
          'margin': '0 6px'
        })
        $('#articleCont pre').css({
          'white-space': 'pre-wrap',
          'word-wrap': 'break-word',
          'border': '1px solid rgba(0,0,0,0.3)',
          'overflow': 'auto',
          'font-size': '14px',
          'background-color': 'white',
          'padding': '15px',
          'line-height': '18px',
          'margin': '6px'
        })
        $('#articleCont h1').css({
          'background-color': '#a1d0dd',
          'border-left': '6px solid #3b636e',
          'border-right': '6px solid #3b636e',
          'border-radius': '6px',
          'line-height': '26px',
          'margin': '10px 0',
          'padding': '10px 13px',
          'max-height': '500px',
          'overflow': 'auto',
          'font-size': '20px',
          'text-align': 'left'
        })
      },
      ...mapMutations({
        setCurrentArticle: 'SET_CURRENT_ARTICLE'
      })
    },
    watch: {
      articleDetail (newVal) {
        this.setArticleContent(newVal)
      }
    },
    components: {
      Comment
    }
  }
</script>