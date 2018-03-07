<template>
  <div class="article-left" :class="{'move': isMove}">
    <!-- 作者名字 -->
    <div class="name-wrapper wrapper">
      <div class="name-pic pic">
        <img src="./user.svg" alt="" width="20px" height="30px">
      </div>
      <div class="name-text text">{{item.userName}}</div>
    </div>
    <div class="line"></div>
    <!-- 发表时间 -->
    <div class="time-wrapper wrapper">
      <div class="time-pic pic">
        <img src="./time.svg" alt="" width="20px" height="30px">
      </div>
      <div class="time-text text">{{item.publishTime}}</div>
    </div>
    <div class="line"></div>
    <!-- 浏览数量 -->
    <div class="visit-wrapper wrapper">
      <div class="visit-pic pic">
        <img src="./eye.svg" alt="" width="20px" height="30px">
      </div>
      <div class="visit-text text">{{item.articleVisit}}浏览</div>
    </div>
    <div class="line"></div>
    <!-- 评论数目 -->
    <div class="comment-wrapper wrapper">
      <div class="comment-pic pic">
        <img src="./message.svg" alt="" width="20px" height="30px">
      </div>
      <div class="comment-text text">{{item.articleComment}}评论</div>
    </div>
    <div class="line"></div>
    <!-- 收藏数量 -->
    <div class="collect-wrapper wrapper">
      <div class="collect-pic pic">
        <img src="./heart-in-love.svg" alt="" width="20px" height="30px">
      </div>
      <div class="collect-text text">{{item.articleLove}}喜欢</div>
    </div>
    <div class="icon-left icon1" v-if="isMove"></div>
    <div class="icon-left icon2" v-if="isMove"></div>
    <div class="icon-left icon3" v-if="isMove"></div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ArticleLeft.styl'
</style>

<script type="text/ecmascript-6">
  // 文章列表左边部分
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
    }
  }
</script>


