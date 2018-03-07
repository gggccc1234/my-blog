<template>
  <div class="button-wrapper">
    <div class="check" @click="checkObj()" v-if="isCheck">选中当前{{text}}</div>
    <div class="turn" @click="turnObj()" v-if="isTurn">跳转到当前{{text}}</div>
    <div class="delete" @click="deleteObj()" v-if="isDelete">删除当前{{text}}</div>
    <div class="watch" @click="watchObj()" v-if="isWatch">取消关注{{text}}</div>
    <div class="collect" @click="collectObj()" v-if="isCollect">取消收藏{{text}}</div>
    <div class="publish" @click="publishObj()" v-if="isPublish">发布当前{{text}}</div>
    <div class="loop" @click="loopObj()" v-if="isLoop !== 0"><span v-if="isLoop === 1">设为热门</span><span v-if="isLoop === 2">取消热门</span></div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'OperateButton.styl'
</style>

<script type="text/ecmascript-6">
// 后台操作按钮的基本组件，所有后台按钮组件都基于当前组件
  export default {
    props: {
      isCheck: {
        type: Boolean,
        default: false
      },
      isTurn: {
        type: Boolean,
        default: false
      },
      isDelete: {
        type: Boolean,
        default: false
      },
      isWatch: {
        type: Boolean,
        default: false
      },
      isCollect: {
        type: Boolean,
        default: false
      },
      isPublish: {
        type: Boolean,
        default: false
      },
      isLoop: {
        type: Number,
        default: 0
      },
      text: {
        type: String,
        default: '文章'
      }
    },
    methods: {
      checkObj () {
        this.$emit('check')
      },
      turnObj () {
        this.$emit('turn')
      },
      deleteObj () {
        this.$emit('delete')
      },
      watchObj () {
        this.$emit('watch')
      },
      collectObj () {
        this.$emit('collect')
      },
      publishObj () {
        this.$emit('publish')
      },
      loopObj () {
        this.$emit('loop')
      }
    }
  }
</script>