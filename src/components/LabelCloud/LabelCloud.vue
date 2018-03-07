<template>
  <div class="label-wrapper">
    <ul class="label" v-for="item in labelLists">
      <li class="label-item" @click="clickLabel(item)">
        <div class="label-content" v-if="isLabel">
          {{item.name}}
          <span class="label-num">{{item.num}}</span>
        </div>
        <div class="friend-content" v-if="isFriend">
          <a :href="item.url">{{item.name}}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'LabelCloud.styl'
</style>

<script type="text/ecmascript-6">
// 标签云组件
  import {mapMutations, mapGetters} from 'vuex'
  import axios from 'axios'

  export default {
    props: {
      labelLists: {
        type: Array,
        default: () => []
      },
      // 外部组件传进来的列表数组
      isLabel: {
        type: Boolean,
        default: true
      },
      // 标签类ui
      // 本组件有多种ui模式
      isFriend: {
        type: Boolean,
        default: false
      },
      // 网址类ui
      tag: {
        type: String,
        defailt: ''
      }
      // 被点击的列表项目的文本内容
      // 用于索引文章的参数
    },
    computed: {
      ...mapGetters([
        'page',
        'pageSize',
        'search',
        'sort'
      ])
    },
    methods: {
      clickLabel (item) {
        // 标签类被点击时根据文本索引文章
        if (this.isLabel) {
          this.searchTag(item.name)
        }
        // 网址类被点击时进行跳转
        if (this.isFriend) {
          this.jumpLink(item.url)
        }
      },
      jumpLink (url) {
        window.open(url)
      },
      // 根据标签的内容查找文章
      searchTag (name) {
        let search = {
          tag: this.tag,
          name: name
        }
        this.setSearch(search)
        this.setPage(1)
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
            this.setarticleLists(res.result)
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setarticleLists: 'SET_ARTICLE_LISTS',
        setSearch: 'SET_SEARCH',
        setPage: 'SET_PAGE'
      })
    }
  }
</script>
