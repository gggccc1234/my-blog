<template>
  <div class="hot-wrapper">
    <div class="hot-list" v-for="(item,index) in hotLists">
      <div class="hot-item" @click="changeHot(item, index)">
        <div class="hot-head">
          <span class="hot-rank">{{index+1}}</span>
          <span class="hot-name">{{item.articleTitle}}</span>
          <span class="heart-icon">
            <img src="./heart-in-love.svg" alt="" width="20px" height="30px">
          </span>
          <span class="heart-num">{{item.articleLove}}</span>
        </div>
        <transition name="hot">
          <div class="hot-pic-wrapper" v-show="currentHot===index">
            <img v-lazy='item.articleAvatarUrl + "-minipic"' width="300px" height="150px">
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'AccordionList.styl'
</style>

<script type="text/ecmascript-6">
  import {turnArticleMixin} from '@/common/js/mixin'
  // 手风琴插件组件
  export default {
    mixins: [turnArticleMixin],
    data () {
      return {
        currentHot: 0,
        // 当前处于激活状态的列表项目
        isChangeHot: true,
        // 能否切换列表项目
        // 防止点击过快设立的控制变量
        article: {}
        // 当前处于激活状态的列表项目的详细信息
      }
    },
    props: {
      hotLists: {
        type: Array,
        default: []
      }
      // 外部组件传进来列表内容
    },
    methods: {
      // 手风琴效果切换
      changeHot (item, index) {
        if (!this.isChangeHot) {
          return
        }
        if (this.currentHot === index) {
          this.article = item
          this.turnArticle()
          return
        }
        this.isChangeHot = false
        this.currentHot = index
        // 防止快速点击，延时触发
        setTimeout(() => {
          this.isChangeHot = true
        }, 500)
      }
    }
  }
</script>

