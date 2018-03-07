<template>
  <div class="user-lists">
    <div class="no-article" v-show="noUser">你还没有选任何用户呢，请先选定一位用户</div>
    <div class="love-list-wrapper" v-show="!noUser">
      <ul class="article-list" v-for="(item, index) in userLoveLists">
        <li class="article-item">
          <article-left :item='item' :isMove='false'></article-left>
          <article-right :item='item' :isMove='false'></article-right>
        </li>
        <article-button :article='item' :isCollect="isCollect" :isDelete="isDelete" @collect="collectArticle(item)"></article-button>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .user-lists
    .love-list-wrapper
      .article-list
        margin-top: 20px
        .article-item
          display: flex
          flex-direction: row
          height: auto
</style>

<script  type="text/ecmascript-6">
// 后台管理用户收藏文章页面列表
  import axios from 'axios'
  import TurnPage from '@/components/TurnPage/TurnPage'
  import {mapGetters} from 'vuex'
  import ArticleButton from '@/components/ArticleButton/ArticleButton'
  import ArticleLeft from '@/components/ArticleLeft/ArticleLeft'
  import ArticleRight from '@/components/ArticleRight/ArticleRight'
  import {collectMixin} from '@/common/js/mixin'
  import {decodeArticle} from '@/common/js/util'

  export default {
    mixins: [collectMixin],
    data () {
      return {
        userLoveLists: [],
        // 收藏文章列表
        noUser: true,
        // 当前是否选中用户
        isCollect: true,
        // 控制按钮的显示
        // 显示收藏按钮
        isDelete: false
        // 显示删除按钮
      }
    },
    computed: {
      ...mapGetters([
        'checkUser'
      ])
    },
    mounted () {
      if (this.checkUser.userLoveArticles === '' || this.checkUser.userLoveArticles === null || this.checkUser.userLoveArticles === undefined) {
        this.noUser = true
      } else {
        this.noUser = false
        this.getCollectArticle()
      }
      console.log(this.noUser)
    },
    methods: {
      // 改变文章的收藏状态
      collectArticle (item) {
        this.collect(item.articleId, this.checkUser.userId)
        let temp = this.userLoveLists.filter((item1) => {
          return item !== item1
        })
        this.userLoveLists = temp
      },
      // 获取收藏文章列表
      getCollectArticle () {
        let userLoveArticles = []
        this.checkUser.userLoveArticles.forEach((item) => {
          userLoveArticles.push(item.articleId)
        })
        axios.post('/users/collectlist', {
          userId: this.checkUser.userId,
          userLoveArticles: userLoveArticles
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.userLoveLists = res.result
            this.userLoveLists.forEach((item) => {
              decodeArticle(item)
            })
          } else {
            console.log(res.msg)
          }
        })
      }
    },
    watch: {
      checkUser (newVal) {
        if (newVal.userId === '' || newVal.userId === null || newVal.userId === undefined) {
          this.noUser = true
        } else {
          this.noUser = false
          this.getCollectArticle()
        }
      }
    },
    components: {
      TurnPage,
      ArticleButton,
      ArticleLeft,
      ArticleRight
    }
  }
</script>
