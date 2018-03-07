<template>
  <div class="border-wrapper">
    <div class="operate">
      <ul v-for="(item, index) in operateLists">
        <div class="operate-item" :class="{active: currentItem === index}" @click="setItem(index)">{{item.text}}</div>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item, index) in operateLists">
        <li v-show="currentItem === index">
          <slot :name="item.name"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'AdminBorder.styl'
</style>

<script type="text/ecmascript-6">
  // 管理页面样式外边框组件
  export default {
    props: {
      operateLists: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        currentItem: 0
      }
    },
    methods: {
      setItem (index) {
        this.currentItem = index
      }
    }
  }
</script>