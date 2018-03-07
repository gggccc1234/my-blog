<template>
  <div class="article-right" :class="{'move': isMove}">
    <div class="article-title-wrapper">
      <span class="article-label">{{item.articleLabels[0].labelName}}</span>
      <span class="article-title">{{item.articleTitle}}</span>
    </div>
    <div class="article-content-wrapper">
      <div class="article-pic-wrapper"><div class="article-pic" :class="item.articleId"></div></div>
      <div class="article-top">
        <p class="article-summary">
          {{item.articleSummary}}
        </p>
      </div>
    </div>
    <div class="icon-right icon1" v-if="isMove"></div>
    <div class="icon-right icon2" v-if="isMove"></div>
    <div class="icon-right icon3" v-if="isMove"></div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ArticleRight.styl'
</style>

<script type="text/ecmascript-6">
// 文章列表右边部分
  export default {
    props: {
      // 当前项的数据
      item: {
        type: Object,
        default: () => {}
      },
      // 控制小屏幕下组件的显示样式
      isMove: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      // 添加背景图片
      var doms = document.getElementsByClassName(this.item.articleId)
      for (let i = 0; i < doms.length; i++) {
        doms[i].style['backgroundImage'] = 'url(' + this.item.articleAvatarUrl + '-minipic)'
      }
    }
  }
</script>

