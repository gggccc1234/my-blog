<template>
  <div class="button-list">
    <div class="prev-page" @click="prevPage()">上一页</div>
    <div class="now-page">
      <div class="now-page-num" v-text="page"></div>
    </div>
    <div class="next-page" @click="nextPage()">下一页</div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'TurnPage.styl'
</style>

<script type="text/ecmascript-6">
// 页面切换按钮组件
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'page',
        'allPage'
      ])
    },
    methods: {
      prevPage () {
        if (this.page <= 1) {
          return
        }
        this.$emit('prev')
      },
      nextPage () {
        this.$emit('next')
      }
    }
  }
</script>

