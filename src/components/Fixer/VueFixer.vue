<template>
  <div class="fix">
    <!-- 回到顶部 -->
    <div class="fix-top" @click="moveTop()">
      <img src="./top.svg" alt="" width="30px" height="40px">
    </div>
    <!-- 进入个人中心 -->
    <div class="fix-login" @click="depathLogin()">
      <img src="./personal.svg" alt="" width="30px" height="40px">
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Fixer.styl'
</style>

<script type="text/ecmascript-6">
// 首页浮动组件，包括回到顶部按钮和进入个人中心
  import {loginMixin} from '@/common/js/mixin'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    mixins: [loginMixin],
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    methods: {
      depathLogin () {
        if (!this.loginSuccess) {
          alert('您还没有登录')
          this.isOp()
        } else {
          this.setCheckUser(this.currentUser)
          this.$router.push('/mainpage/user')
        }
      },
      ...mapMutations({
        setCheckUser: 'SET_CHECK_USER'
      })
    }
  }
</script>