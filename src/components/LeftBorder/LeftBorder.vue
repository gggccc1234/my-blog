<template>
  <div class="border-article">
    <div class="border-title">{{contentTitle}}</div>
    <div class="border-line"></div>
    <slot></slot>
    <!-- slot插槽 -->
  </div>
</template>

<style lang="stylus" scoped>
  @import 'LeftBorder.styl'
</style>

<script script type="text/ecmascript-6">
// 公用边框组件
  export default {
    props: {
      contentTitle: {
        // 边框标题
        type: String,
        default: '排行'
      }
    }
  }
</script>


