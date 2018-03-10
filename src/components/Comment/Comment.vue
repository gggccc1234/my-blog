<template>
  <div class="comment-wrapper">
    <div class="comment">
      <!-- 发表评论 -->
      <div class="publish-comment">
        <div class="operate" id="operate"></div>
        <div class="writebox" id="writebox">
        </div>
        <span @click.stop="commentP()" class="publish-text">
          <span class="text">发表评论</span>
        </span>
      </div>
      <!-- 评论列表 -->
      <comment-lists :articleComments="articleComments"></comment-lists>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import "Comment.styl"
</style>

<script type="text/ecmascript-6">
// 评论组件
  import E from 'wangeditor'
  import {mapGetters, mapMutations} from 'vuex'
  import axios from 'axios'
  import CommentLists from '@/components/CommentLists/CommentLists'
  import {loginMixin} from '@/common/js/mixin'
  import xss from 'xss'

  export default {
    name: 'editor',
    mixins: [loginMixin],
    props: {
      articleComments: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        editorContent: '',
        // 编辑框的内容
        yzmText: '',
        yzmT: ''
      }
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'currentArticle'
      ])
    },
    mounted () {
      // 初始化富文本编辑器
      var editorcomment = new E('#operate', '#writebox')
      editorcomment.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editorcomment.customConfig.menus = [
        'emoticon',
        'image',
        'code',
        'justify'
      ]
      editorcomment.create()
    },
    methods: {
      // 发表评论
      commentP () {
        if (!this.loginSuccess) {
          alert('您还没有登录')
          this.isOp()
          return
        }
        axios.post('/articlelist/comment', {
          articleId: this.currentArticle.articleId,
          userId: this.currentUser.userId,
          commentText: encodeURIComponent(xss(this.editorContent)),
          userName: escape(this.currentUser.userName),
          userAvatarUrl: encodeURIComponent(this.currentUser.userAvatarUrl),
          floor: this.currentArticle.articleComment + 1
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            let comment = res.result
            comment.commentText = decodeURIComponent(comment.commentText)
            comment.userName = unescape(comment.userName)
            comment.userAvatarUrl = decodeURIComponent(comment.userAvatarUrl)
            this.articleComments.unshift(comment)
            this.setCommentadd()
          }
        })
      },
      ...mapMutations({
        setCommentadd: 'SET_COMMENT_ADD'
      })
    },
    components: {
      CommentLists
    }
  }
</script>

