<template>
  <div class="loop-pic-wrapper" >
    <div class="loop-pic">
      <ul v-for="(item, index) in loopPics">
        <transition name="loop">
          <li class="pic" v-show="currentPage === index">
            <picture>
              <img v-lazy='item.articleAvatarUrl' width="100%">
            </picture>
            <div class="text">{{item.articleTitle}}</div>
          </li>
        </transition>
      </ul>
    </div>
    <div class="loop-button-wrapper">
      <div class="icon loop-button" @click="subPage()">
        <img src="./left.svg" alt="" width="70%" height="100%">
      </div>
      <ul v-for="(item, index) in loopPics">
        <div class="page loop-button" @click="changePage(index)" :class="{'active': currentPage === index}">{{index + 1}}</div>
      </ul>
      <div class="icon loop-button" @click="addPage()">
        <img src="./right.svg" alt="" width="70%" height="100%">
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'LoopPic.styl'
</style>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import axios from 'axios'

// 轮播图组件
  export default {
    data () {
      return {
        timer: false,
        loopPics: [],
        // 轮播图数据列表
        currentPage: 0,
        // 轮播图当前激活项目的编号
        isCurrentPage: false
        // 控制是否轮播的参数
      }
    },
    computed: {
      ...mapGetters([
        'page',
        'allPage',
        'search',
        'sort',
        'articleLists',
        'pageSize'
      ])
    },
    mounted () {
      this.getLoopPic()
      // 窗口失去焦距后轮播图暂停
      window.addEventListener('focus', () => {
        this.timer = false
        this.autoLoop()
      })
      // 窗口获得焦距后轮播图再次播放
      window.addEventListener('blur', () => {
        this.timer = true
      })
      this.autoLoop()
    },
    methods: {
      // 自动轮播
      autoLoop () {
        if (this.timer) {
          return
        }
        this.addPage()
        setTimeout(() => {
          this.autoLoop()
        }, 3000)
      },
      // 轮播到下一页
      addPage () {
        if (this.currentPage === this.loopPics.length - 1) {
          this.changePage(0)
        } else {
          this.changePage(this.currentPage + 1)
        }
      },
      // 轮播到上一页
      subPage () {
        if (this.currentPage === 0) {
          this.changePage(this.loopPics.length - 1)
        } else {
          this.changePage(this.currentPage - 1)
        }
      },
      // 防止快速点击
      changePage (index) {
        if (this.isCurrentPage) {
          return
        }
        this.isCurrentPage = true
        this.currentPage = index
        setTimeout(() => {
          this.isCurrentPage = false
        }, 500)
      },
      // 获取轮播图列表数据
      getLoopPic () {
        let search = {
          tag: 'loop',
          name: true
        }
        this.setSearch(search)
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          search: this.search,
          sort: this.sort
        }
        let url = '/articlelist'
        axios.get(url, {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.loopPics = res.result
            this.resetSearch()
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setSearch: 'SET_SEARCH',
        resetSearch: 'RESET_SEARCH'
      })
    }
  }
</script>

