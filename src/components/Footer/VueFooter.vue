<template>
  <div class="footer">
    <div class="line"></div>
      <div @click="adminLogin()" class="adminlogin">版权所有丨基于 Vue2.0 + Node.js + MongoDB 构建 © 2017丨托管于 阿里云主机 & 七牛云存储 | 进入后台管理</div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Footer.styl'
</style>

<script type="text/ecmascript-6">
  import {loginMixin} from '@/common/js/mixin'
  import {mapGetters, mapMutations} from 'vuex'
  // import axios from 'axios'

  export default {
    mixins: [loginMixin],
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    methods: {
      // 判断是否是管理员，管理员才能登陆
      adminLogin () {
        if (this.loginSuccess && this.currentUser) {
          this.setIsAdmin(true)
          this.$router.push('/admin')
          // axios.post('/users/admin', {
          //   userId: this.currentUser.userId
          // }).then((response) => {
          //   let res = response.data
          //   console.log(res)
          //   if (res.status === '0' || res.status === 0) {
          //     this.setIsAdmin(true)
          //     this.$router.push('/admin')
          //   } else {
          //     return null
          //   }
          // })
        } else {
          return null
        }
      },
      ...mapMutations({
        setIsAdmin: 'SET_IS_ADMIN'
      })
    }
  }
</script>
