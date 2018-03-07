<template>
  <div class="article-comments">
    <div class="no-article" v-show="noArticle">你还没有选任何文章呢，请先选定一篇文章</div>
    <comment-lists :isOperate="isOperate" :articleComments="articleDetail.articleComments" v-show="!noArticle" @comment="setArticleComments()"></comment-lists>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script  type="text/ecmascript-6">
// 后台管理文章评论页面
  import {getDetailMixin} from '@/common/js/mixin'
  import CommentLists from '@/components/CommentLists/CommentLists'
  import {mapGetters} from 'vuex'

  export default {
    mixins: [getDetailMixin],
    data () {
      return {
        noArticle: true,
        isOperate: true
      }
    },
    computed: {
      ...mapGetters([
        'currentArticle'
      ])
    },
    methods: {
      setArticleComments () {
        this.getArticleDetail(this.currentArticle.articleId)
      }
    },
    mounted () {
      if (this.currentArticle.articleId === '' || this.currentArticle.articleId === null || this.currentArticle.articleId === undefined) {
        this.noArticle = true
      } else {
        this.noArticle = false
        this.getArticleDetail(this.currentArticle.articleId)
      }
    },
    components: {
      CommentLists
    },
    watch: {
      // 监听当前文章是否发生改变，若值不为空，从新请求文章评论数据
      currentArticle (newVal, oldVal) {
        if (newVal === oldVal) {
          return null
        } else if (newVal.articleId === '' || newVal.articleId === null || newVal.articleId === undefined) {
          this.noArticle = true
        } else {
          this.noArticle = false
          this.getArticleDetail(newVal.articleId)
        }
      }
    }
  }
</script>