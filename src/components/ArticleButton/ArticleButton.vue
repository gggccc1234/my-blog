<template>
  <div class="article-button-wrapper">
    <operate-button :isCheck="isCheck" :isTurn="isTurn" :isDelete="isDelete" :isCollect="isCollect" :isPublish="isPublish" :isLoop="isLoop" @loop="toggleLoop()" @turn="turnArticle()" @check="checkArticle()" @delete="deleteArticle()" @collect="collectArticle()" @publish="publishArticle()"></operate-button>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
// 管理文章的操作按钮样式
  import {turnArticleMixin} from '@/common/js/mixin'
  import {mapMutations} from 'vuex'
  import OperateButton from '@/components/OperateButton/OperateButton'
  import axios from 'axios'

  export default {
    mixins: [turnArticleMixin],
    props: {
      article: {
        type: Object,
        default: () => {}
      },
      isCheck: {
        type: Boolean,
        default: true
      },
      isTurn: {
        type: Boolean,
        default: true
      },
      isDelete: {
        type: Boolean,
        default: true
      },
      isCollect: {
        type: Boolean,
        default: false
      },
      isPublish: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isLoop: 1
      }
    },
    mounted () {
      if (this.article.loop) {
        this.isLoop = 2
      }
    },
    methods: {
      checkArticle () {
        this.setCurrentArticle(this.article)
      },
      deleteArticle () {
        this.$emit('delete')
      },
      collectArticle () {
        this.$emit('collect')
      },
      publishArticle () {
        this.$emit('publish')
      },
      toggleLoop () {
        this.isLoop = 3 - this.isLoop
        let param = {
          articleId: this.article.articleId,
          loop: !this.article.loop
        }
        axios.get('/articlelist/loop', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setCurrentArticle: 'SET_CURRENT_ARTICLE'
      })
    },
    components: {
      OperateButton
    }
  }
</script>


