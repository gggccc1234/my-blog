<template>
  <div class="article-wrapper">
    <ul class="article-list" v-for="(item, index) in articleLists">
      <li class="article-item" @click="turnArt(item, index)">
        <article-left :item='item'></article-left>
        <article-right :item='item'></article-right>
      </li>
    </ul>
    <turn-page @prev='onprevPage()' @next='onnextPage()'></turn-page>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'HotArticleList.styl'
</style>

<script type="text/ecmascript-6">
// 首页文章列表组件
  import TurnPage from '@/components/TurnPage/TurnPage'
  import {mapGetters, mapMutations} from 'vuex'
  import ArticleLeft from '@/components/ArticleLeft/ArticleLeft'
  import ArticleRight from '@/components/ArticleRight/ArticleRight'
  import {turnArticleMixin} from '@/common/js/mixin'

  export default {
    mixins: [turnArticleMixin],
    computed: {
      ...mapGetters([
        'articleLists',
        'page',
        'pageSize'
      ])
    },
    data () {
      return {
        article: {}
      }
    },
    methods: {
      onprevPage () {
        this.$emit('prev')
      },
      // 上一页
      onnextPage () {
        this.$emit('next')
      },
      // 下一页
      turnArt (item, index) {
        this.article = item
        this.setIndexPage((this.page - 1) * this.pageSize + index + 1)
        this.turnArticle()
      },
      // 跳转到正文
      ...mapMutations({
        setIndexPage: 'SET_INDEX_PAGE'
      })
    },
    components: {
      TurnPage,
      ArticleLeft,
      ArticleRight
    }
  }
</script>


