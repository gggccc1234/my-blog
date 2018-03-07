<template>
  <div class="user-comments">
    <div class="no-article" v-if="noUser">你还没有选任何用户呢，请先选定一位用户</div>
    <comment-lists :isOperate="isOperate" :articleComments="articleComments" v-if="!noUser" @comment="setArticleComments()"></comment-lists>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script  type="text/ecmascript-6">
// 后台用户评论管理列表
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import CommentLists from '@/components/CommentLists/CommentLists'
  import {decodeComment} from '@/common/js/util'

  export default {
    data () {
      return {
        articleComments: [],
        noUser: true,
        isOperate: true
      }
    },
    computed: {
      ...mapGetters([
        'isChecked',
        'checkUser'
      ])
    },
    mounted () {
      if (this.checkUser.userId === '' || this.checkUser.userId === null || this.checkUser.userId === undefined) {
        this.noUser = true
      } else {
        this.noUser = false
        this.getUserComment()
      }
    },
    methods: {
      setArticleComments () {
        this.getUserComment()
      },
      // 获取用户评论
      getUserComment () {
        axios.post('/users/commentdetail', {
          userComments: this.checkUser.userComments,
          userId: this.checkUser.userId
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.articleComments = res.result
            this.articleComments.forEach((item) => {
              decodeComment(item)
            })
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
          this.getUserComment()
        }
      }
    },
    components: {
      CommentLists
    }
  }
</script>