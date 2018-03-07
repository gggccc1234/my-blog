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
      <div class="line"></div>
      <!-- 文章正文 -->
      <div class="articleContent">
        <div id="123"></div>
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
      setArticleContent (obj) {
        document.getElementById('123').innerHTML = obj.articleContent
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