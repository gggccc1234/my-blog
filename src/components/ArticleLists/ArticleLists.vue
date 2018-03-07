<template>
  <div class="article-wrapper">
    <ul class="article-list" v-for="(item, index) in articleLists">
      <li class="article-item">
        <article-left :item='item' :isMove='false'></article-left>
        <article-right :item='item' :isMove='false'></article-right>
      </li>
      <article-button :article='item' @delete='deleteArticle(item)'></article-button>
    </ul>
    <turn-page @prev='onprevPage()' @next='onnextPage()'></turn-page>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ArticleLists.styl'
</style>

<script type="text/ecmascript-6">
  // 文章列表
  import TurnPage from '@/components/TurnPage/TurnPage'
  import {mapGetters, mapMutations} from 'vuex'
  import ArticleButton from '@/components/ArticleButton/ArticleButton'
  import ArticleLeft from '@/components/ArticleLeft/ArticleLeft'
  import ArticleRight from '@/components/ArticleRight/ArticleRight'
  import axios from 'axios'

  export default {
    computed: {
      ...mapGetters([
        'articleLists',
        'page',
        'pageSize',
        'search',
        'sort'
      ])
    },
    mounted () {
      this.getPageArticle(1)
    },
    methods: {
      onprevPage () {
        if (this.page === 1) {
          return null
        } else {
          this.getPageArticle(this.page - 1)
        }
      },
      onnextPage () {
        this.getPageArticle(this.page + 1)
      },
      // 删除文章
      deleteArticle (item) {
        let articleId = item.articleId
        let param = {
          articleId: articleId
        }
        axios.get('articlelist/deletearticle', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.setArticleListsPull(articleId)
          }
        })
      },
      // 获取文章列表
      getPageArticle (page) {
        this.setPage(page)
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          search: this.search,
          sort: this.sort
        }
        let url = '/articlelist'
        axios.get(url, {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            if (res.result.length !== 0) {
              this.setArticleLists(res.result)
            } else {
              alert('已经是世界的尽头了~~~')
              this.setPageSub()
            }
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setArticleListsPull: 'SET_ARTICLE_LISTS_PULL',
        setArticleLists: 'SET_ARTICLE_LISTS',
        setPage: 'SET_PAGE',
        setPageSub: 'SET_PAGE_SUB'
      })
    },
    components: {
      TurnPage,
      ArticleButton,
      ArticleLeft,
      ArticleRight
    }
  }
</script>