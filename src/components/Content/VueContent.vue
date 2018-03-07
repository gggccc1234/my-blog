<template>
  <div class="content">
    <div class="vcl-wrapper">
      <router-view></router-view>
    </div>
    <div class="vcr-wrapper">
      <vue-content-right></vue-content-right>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'Content.styl'
</style>

<script type="text/ecmascript-6">
// 首页内容组件
  import VueContentRight from '@/components/ContentRight/VueContentRight'

  export default {
    components: {
      VueContentRight
    }
  }
</script>