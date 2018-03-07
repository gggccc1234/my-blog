<template>
  <div class="article">
    <admin-border :operateLists="userLists">
      <article-detail slot="pblarticle">pblarticle</article-detail>
      <div slot="lblmanage">lblmanage</div>
      <div slot="draftbox">draftbox</div>
    </admin-border>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
  import AdminBorder from '@/components/AdminBorder/AdminBorder'
  import ArticleDetail from '@/components/ArticleDetail/ArticleDetail'

  export default {
    data () {
      return {
        userLists: [
          {
            name: 'pblarticle',
            text: '发表文章'
          }, {
            name: 'lblmanage',
            text: '标签管理'
          }, {
            name: 'draftbox',
            text: '草稿箱'
          }
        ]
      }
    },
    components: {
      AdminBorder,
      ArticleDetail
    }
  }
</script>