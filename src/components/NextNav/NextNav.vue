<template>
  <div class="down-wrapper">
    <div class="notice-wrapper">
      <div class="notice" @click="showNotice()">
        <img src="./notice.svg" class="notice-icon" width="30px" height="40px">
      </div>
    </div>
    <transition name="notice">
      <div class="notice-detail-wrapper" v-show="isNotice">
        <div class="notice-detail">
          个人网站终于上线啦，谢谢各位访客的到来，发现bug请向2011033907@qq.com提交。
        </div>
      </div>
    </transition>
    <div class="search-wrapper" @click="showSearchP()">
      <div class="search">
        <img src="./search.svg" class="search-icon" width="30px" height="40px">
      </div>
    </div>
    <transition name="search">
      <div class="search-text-wrapper" v-show="isSearch">
        <div class="search-text">
          <input type="text" class="text" placeholder="请输入要搜索的内容" v-model="searchText">
        </div>
      </div>
    </transition>
    <div class="login-wrapper" @click.stop="isLoOrRe()">
      <div class="login"><span class="lotext" :class="{'isLotext': isLogin}" v-text="textName"></span><span class="lopic" :class="{'isLopic': isLogin}"><img src="./login.svg" class="login-icon" width="30px" height="40px"></span></div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'NextNav.styl'
</style>

<script type="text/ecmascript-6">
// 包含搜索框和公告栏的次级导航栏
  import {loginMixin, searchMixin} from '@/common/js/mixin'

  export default {
    mixins: [loginMixin, searchMixin],
    data () {
      return {
        isSearch: false,
        // 是否显示搜索框
        isNotice: true
        // 是否显示公告
      }
    },
    methods: {
      // 切换公告栏
      showNotice () {
        if (this.isNotice) {
          return
        }
        this.isSearch = false
        this.$nextTick(() => {
          this.isNotice = true
        })
      },
      // 切换搜索框
      showSearchP () {
        if (this.isSearch) {
          this.showSearch()
          return null
        }
        this.isNotice = false
        this.$nextTick(() => {
          this.isSearch = true
        })
      }
    }
  }
</script>

