<template>
  <div class="articles">
    <admin-border :operateLists="userLists">
      <article-lists slot="articlelist"></article-lists>
      <article-detail slot="detailmsg"></article-detail>
      <article-comments slot="cmtmanage"></article-comments>
      <label-manage slot="lblManage"></label-manage>
      <draft-box slot="draftbox"></draft-box>
    </admin-border>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
// 后台文章管理总页面
  import AdminBorder from '@/components/AdminBorder/AdminBorder'
  import ArticleDetail from '@/components/ArticleDetail/ArticleDetail'
  import LabelManage from '@/components/LabelManage/LabelManage'
  import ArticleLists from '@/components/ArticleLists/ArticleLists'
  import DraftBox from '@/components/DraftBox/DraftBox'
  import ArticleComments from '@/components/ArticleComments/ArticleComments'

  export default {
    data () {
      return {
        userLists: [
          {
            name: 'articlelist',
            text: '文章列表'
          }, {
            name: 'detailmsg',
            text: '详细信息'
          }, {
            name: 'cmtmanage',
            text: '评论管理'
          }, {
            name: 'lblManage',
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
      ArticleDetail,
      LabelManage,
      ArticleLists,
      ArticleComments,
      DraftBox
    }
  }
</script>
