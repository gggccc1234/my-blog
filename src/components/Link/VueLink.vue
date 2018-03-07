<template>
  <div class="link-me">
    <div class="link-item github" @click="jumpLink('https://github.com/guichuju')">
      <div class="link-wrapper">
        <img src="./github.svg" width="40px" height="40px">
      </div>
      <span class="tooltip top_tooltip">github</span>
    </div>
    <div class="link-item weibo" @click="jumpLink('https://weibo.com/u/5358269212?topnav=1&wvr=6&topsug=1&is_hot=1')">
      <div class="link-wrapper">
        <img src="./weibo.svg" width="40px" height="40px">
      </div>
      <span class="tooltip top_tooltip">weibo</span>
    </div>
    <div class="link-item">
      <div class="link-wrapper">
        <img src="./weixin.svg" width="40px" height="40px">
      </div>
      <span class="tooltip bottom_tooltip weixin"><img src="./weixin_erweima.png" width="240px" height="240px"></span>
    </div>
    <div class="link-item">
      <div class="link-wrapper">
        <img src="./qq.svg" width="40px" height="40px">
      </div>
      <span class="tooltip bottom_tooltip qq"><img src="./qq_erweima.png" width="240px" height="240px"></span>
    </div>
    <div class="link-item">
      <div class="link-wrapper">
        <img src="./email.svg" width="40px" height="40px">
      </div>
      <span class="tooltip bottom_tooltip email">2011033907@qq.com</span>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Link.styl'
</style>

<script type="text/ecmascript-6">
// 首页联系方式组件
  export default {
    methods: {
      jumpLink (url) {
        window.open(url)
      }
    }
  }
</script>

