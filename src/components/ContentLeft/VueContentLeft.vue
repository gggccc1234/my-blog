<template>
  <div class="left">
    <loop-pic :page='page' :allPage='allPage'></loop-pic>
    <hot-article-list @prev='onprevPage()' @next='onnextPage()'></hot-article-list>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ContentLeft.styl'
</style>

<script type="text/ecmascript-6">
  // 首页文章列表
  import LoopPic from '@/components/LoopPic/LoopPic'
  import HotArticleList from '@/components/HotArticleList/HotArticleList'
  import axios from 'axios'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    created () {
      // this.setPage(1)
      // this.setPageSize(10)
      // this.setSort({
      //   publishTime: -1
      // })
      this.getPageArticle()
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
    methods: {
      // 向前翻页
      onprevPage () {
        if (this.page === 1) {
          return
        }
        this.setPageSub()
        this.getPageArticle()
      },
      // 向后翻页
      onnextPage () {
        this.setPageAdd()
        this.getPageArticle()
      },
      // 根据当前页数每次只请求十条数据，按需加载
      getPageArticle () {
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
            if (res.result.length !== 0) {
              this.setArticleLists(res.result)
            } else {
              alert('已经是世界的尽头了~~~')
              this.setPageSub()
            }
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setArticleLists: 'SET_ARTICLE_LISTS',
        setPageAdd: 'SET_PAGE_ADD',
        setPageSub: 'SET_PAGE_SUB',
        setPage: 'SET_PAGE',
        setPageSize: 'SET_PAGE_SIZE',
        setSearch: 'SET_SEARCH',
        setSort: 'SET_SORT'
      })
    },
    components: {
      LoopPic,
      HotArticleList
    }
  }
</script>

