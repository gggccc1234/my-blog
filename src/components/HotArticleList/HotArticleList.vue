<template>
  <div class="article-wrapper">
    <ul class="article-list" v-for="(item, index) in articleLists">
      <li class="article-item" @click="turnArt(item)">
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
  import {mapGetters} from 'vuex'
  import ArticleLeft from '@/components/ArticleLeft/ArticleLeft'
  import ArticleRight from '@/components/ArticleRight/ArticleRight'
  import {turnArticleMixin} from '@/common/js/mixin'

  export default {
    mixins: [turnArticleMixin],
    computed: {
      ...mapGetters([
        'articleLists'
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
      turnArt (item) {
        this.article = item
        this.turnArticle()
      }
      // 跳转到正文
    },
    components: {
      TurnPage,
      ArticleLeft,
      ArticleRight
    }
  }
</script>


