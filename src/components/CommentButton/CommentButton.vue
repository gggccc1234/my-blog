<template>
  <div class="article-button-wrapper">
    <operate-button :text="text" :isCheck="isCheck" :isTurn="isTurn" :isDelete="isDelete" @turn="turnArticle()" @check="checkArticle()" @delete="deleteArticle()"></operate-button>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
// 后台操作评论相关按钮组件
  import {turnArticleMixin} from '@/common/js/mixin'
  import {mapMutations} from 'vuex'
  import OperateButton from '@/components/OperateButton/OperateButton'

  export default {
    mixins: [turnArticleMixin],
    props: {
      article: {
        type: Object,
        default: () => {}
      },
      isCheck: {
        type: Boolean,
        default: false
      },
      isTurn: {
        type: Boolean,
        default: false
      },
      isDelete: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        text: '评论'
      }
    },
    methods: {
      checkArticle () {
        this.setCurrentArticle(this.article)
      },
      deleteArticle () {
        this.$emit('delete')
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