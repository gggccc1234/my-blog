<template>
  <div class="main-page">
    <!-- 博客主页 -->
    <!-- 使用css sticky 粘性布局 -->
    <div class="up-wrap">
      <!-- 上部 -->
      <div class="up clearfix">
        <div class="header-warpper">
          <vue-header></vue-header>
          <!-- 头部组件 -->
        </div>
        <div class="content-warpper">
          <transition name="turnpage">
            <router-view class="turn"></router-view>
          </transition>
        </div>
      </div>
    </div>
    <div class="footer-warpper">
      <!-- 脚部 -->
      <vue-footer></vue-footer>
    </div>
    <div class="fixer">
      <!-- 浮动层 -->
      <vue-fixer></vue-fixer>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'MainPage.styl'
</style>

<script type="text/ecmascript-6">
// 网站首页
  import VueHeader from '@/components/Header/VueHeader'
  import VueFooter from '@/components/Footer/VueFooter'
  import VueFixer from '@/components/Fixer/VueFixer'
  import {loginMixin} from '@/common/js/mixin'
  import axios from 'axios'
  import {decodeUser} from '@/common/js/util'

  export default {
    mixins: [loginMixin],
    mounted () {
      // 主页初始化检查服务器session
      axios.post('/users/main', {}).then((response) => {
        let res = response.data
        if (res.status === 0) {
          decodeUser(res.result)
          this.setCurrentUser(res.result)
          this.setLoginSuccess(true)
        }
      })
    },
    components: {
      VueHeader,
      VueFooter,
      VueFixer
    }
  }
</script>