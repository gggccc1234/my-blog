<template>
  <div class="nav-wrapper">
    <!-- 小屏幕显示的头部导航栏 -->
    <div class="nav-detail">
      <div class="title">遗忘</div>
      <!-- 代替标题 -->
      <img src="./nav.svg" alt="" class="nav-icon" @click="slideNav()">
      <!-- 导航栏收起的按钮 -->
      <transition name="slide">
        <div class="col-nav-wrapper" v-show="isNav">
          <ul class="col-nav" id="col-nav">
            <!-- 原本的头部导航栏 -->
            <ul v-for="(item, index) in navData" class="col-nav-item">
              <li><a href="#" @click="changeNav(index)">{{item}}</a></li>
            </ul>
            <!-- 次级导航栏的搜索框 -->
            <li class="col-nav-item"><a href="#" class="s-a">
              <span class="s-icon-wrp" @click="showSearch"><img src="./search.svg" height="40px" width="50px" class="s-icon"></span>
              <span class="s-wrp"><input class="minsearch" type="text" name="minsearch" placeholder="请输入搜索内容" v-model="searchText"></span>
            </a></li>
            <!-- 登录框 -->
            <li class="col-nav-item"><a href="#" @click.stop="isLoOrRe()" v-text="textName"></a></li>
          </ul>
        </div>
      </transition>
    </div>
    <!-- 大屏幕的头部导航栏 -->
    <ul class="nav">
      <ul v-for="(item, index) in navData" class="nav-item">
        <li><a href="#" :class="{'active': currentNav === index}" @click="changeNav(index)">{{item}}</a></li>
      </ul>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Nav.styl'
</style>

<script type="text/ecmascript-6">
// 响应式导航栏
  import {loginMixin, searchMixin} from '@/common/js/mixin'

  export default{
    mixins: [loginMixin, searchMixin],
    data () {
      return {
        // 导航栏是否显示
        isNav: false,
        // currentNav 当前被点击的项目
        currentNav: -1,
        // navData 导航栏的分类项目
        navData: [
          '学习笔记',
          '作品集',
          '算法题集',
          '关于站长',
          '赞助站长'
        ]
      }
    },
    methods: {
      // 切换导航栏的显示与否
      slideNav () {
        this.isNav = !this.isNav
      },
      // 切换到不同的导航栏项目发生跳转
      changeNav (index) {
        this.currentNav = index
        // 点击导航栏第0个项目跳转到首页
        if (index === 0) {
          this.$router.push('/mainpage')
        } else if (index === 1) {
          this.$router.push('/mainpage/productions')
        } else if (index === 2) {
          this.$router.push('/mainpage/question')
        } else if (index === 3) {
          this.$router.push('/mainpage/aboutme')
        } else if (index === 4) {
          this.$router.push('/mainpage/support')
        }
      }
    }
  }
</script>

