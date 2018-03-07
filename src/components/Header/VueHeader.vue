<template>
  <div class="header">
    <div class="up-wrapper">
      <!-- 头部标题 -->
      <!-- 小屏幕头部标题消失，功能由头部导航栏代替 -->
      <div class="title" id="title">遗忘</div><div class="lower-title" id="lower-title">陈彦锋的个人博客</div>
    </div>
    <!-- 头部导航栏 -->
    <vue-nav></vue-nav>
    <div class="next-nav-wrapper">
      <!-- 次级导航栏 -->
      <!-- 小屏幕次级导航栏消失，功能有头部导航栏代替实现 -->
      <next-nav></next-nav>
    </div>
    <!-- 登录组件 -->
    <transition name="fadelogin">
      <div class="login-box-wrapper" v-show="isLogin">
        <login></login>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import 'Header.styl'
</style>

<script type="text/ecmascript-6">
// 头部组件
  import VueNav from '@/components/Nav/VueNav'
  import Login from '@/components/Login/Login'
  import NextNav from '@/components/NextNav/NextNav'
  import {loginMixin} from '@/common/js/mixin'

  export default {
    mixins: [loginMixin],
    components: {
      VueNav,
      Login,
      NextNav
    }
  }
</script>