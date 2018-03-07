<template>
  <div class="draft-box">
    <ul class="article-list" v-for="(item, index) in draftLists">
      <li class="article-item">
        <article-left :item='item' :isMove='false'></article-left>
        <article-right :item='item' :isMove='false'></article-right>
      </li>
      <article-button :article='item' :isPublish='isPublish' :isTurn='isTurn' :isCheck='isCheck' @publish="publishArticle(item, 0)" @delete="deleteArticle(item)"></article-button>
    </ul>
    <!-- <turn-page @prev='onprevPage()' @next='onnextPage()'></turn-page> -->
  </div>
</template>

<style lang="stylus" scoped>
  @import 'DraftBox.styl'
</style>

<script  type="text/ecmascript-6">
// 后台草稿箱页面
  import TurnPage from '@/components/TurnPage/TurnPage'
  import {mapGetters, mapMutations} from 'vuex'
  import ArticleButton from '@/components/ArticleButton/ArticleButton'
  import ArticleLeft from '@/components/ArticleLeft/ArticleLeft'
  import ArticleRight from '@/components/ArticleRight/ArticleRight'
  import axios from 'axios'

  export default {
    data () {
      return {
        // 草稿列表
        draftLists: [],
        // 控制不同功能按钮
        isTurn: false,
        // 跳转到原文
        isPublish: true,
        // 发表
        isCheck: false
        // 选择
      }
    },
    computed: {
      ...mapGetters([
        'currentDraft',
        'page'
      ])
    },
    created () {
      this.getDraftLists(1)
    },
    methods: {
      getDraftLists (page) {
        this.setPage(page)
        let param = {
          page: 1,
          pageSize: 9999,
          search: {},
          sort: {
            publishTime: -1
          }
        }
        axios.get('/draft/list', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.draftLists = res.result
            this.draftLists.forEach((item) => {
              item.articleTitle = unescape(item.articleTitle)
              item.articleSummary = unescape(item.articleSummary)
              item.userName = unescape(item.userName)
            })
          } else {
            console.log(res.msg)
          }
        })
      },
      onprevPage () {
        if (this.page === 1) {
          return null
        } else {
          this.getDraftLists(this.page - 1)
        }
      },
      onnextPage () {
        this.getDraftLists(this.page + 1)
      },
      deleteArticle (item) {
        this.publishArticle(item, 1)
      },
      publishArticle (item, operate) {
        let param = {
          currentDraft: item,
          operate: operate
        }
        axios.get('/draft/publish', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            let temp = this.draftLists.filter((item1) => {
              return item.articleId !== item1.articleId
            })
            this.draftLists = temp
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setCurrentDraft: 'SET_CURRENT_DRAFT',
        setPage: 'SET_PAGE'
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
