<template>
  <div class="users">
    <admin-border :operateLists="userLists">
      <user-lists slot="clientlist"></user-lists>
      <user-detail slot="msgmanage"></user-detail>
      <user-comments slot="cmtmanage"></user-comments>
      <user-collection slot="colarticle"></user-collection>
    </admin-border>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
// 后台管理用户组件
  import AdminBorder from '@/components/AdminBorder/AdminBorder'
  import UserDetail from '@/components/UserDetail/UserDetail'
  import UserLists from '@/components/UserLists/UserLists'
  import UserComments from '@/components/UserComments/UserComments'
  import UserCollection from '@/components/UserCollection/UserCollection'

  export default {
    data () {
      return {
        userLists: [
          {
            name: 'clientlist',
            text: '用户列表'
          }, {
            name: 'msgmanage',
            text: '信息管理'
          }, {
            name: 'cmtmanage',
            text: '评论管理'
          }, {
            name: 'colarticle',
            text: '收藏文章'
          }
        ]
      }
    },
    components: {
      AdminBorder,
      UserDetail,
      UserLists,
      UserComments,
      UserCollection
    }
  }
</script>


