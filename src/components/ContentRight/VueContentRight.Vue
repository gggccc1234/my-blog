<template>
  <div class="right">
    <vue-link></vue-link>
    <left-border contentTitle='热门排行'>
      <accordion-list :hotLists="hotLists"></accordion-list>
    </left-border>
    <left-border contentTitle='标签云'>
      <label-cloud :labelLists="labelArray" tag='articleLabel'></label-cloud>
    </left-border>
    <left-border contentTitle='猜你喜欢' style="display:none">
      <accordion-list :hotLists="loveLists"></accordion-list>
    </left-border>
    <left-border contentTitle='文章归档'>
      <label-cloud :labelLists="timeArray" tag='publishTime'></label-cloud>
    </left-border>
    <left-border contentTitle='友情链接' style="display:none">
      <label-cloud :labelLists="friendLists" :isLabel="false" :isFriend="true"></label-cloud>
    </left-border>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ContentRight.styl'
</style>

<script>
// 内容栏右边，主要有热门推荐，按标签分类，按时间分类
  import VueLink from '@/components/Link/VueLink'
  import LabelCloud from '@/components/LabelCloud/LabelCloud'
  import AccordionList from '@/components/AccordionList/AccordionList'
  import LeftBorder from '@/components/LeftBorder/LeftBorder'
  import axios from 'axios'
  import {mapMutations, mapGetters} from 'vuex'
  import {decodeArticle} from '@/common/js/util'

  export default {
    data () {
      return {
        hotLists: [],
        // 热门文章列表
        loveLists: [],
        // 喜欢文章列表
        friendLists: []
        // 友链列表
      }
    },
    created () {
      this.getHotArticle()
      this.getLabelLists()
      this.getTimeLists()
    },
    computed: {
      ...mapGetters([
        'labelArray',
        'timeArray'
      ])
    },
    methods: {
      // 获取时间分类
      getTimeLists () {
        axios.get('/time/list', {}).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.setTimeArray(res.result)
          } else {
            console.log(res.msg)
          }
        })
      },
      // 获取标签分类
      getLabelLists () {
        axios.get('/label/list', {}).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.setLabelArray(res.result)
          } else {
            console.log(res.msg)
          }
        })
      },
      // 获取当前评论数最高的五篇热门文章
      getHotArticle () {
        let param = {
          page: 1,
          pageSize: 5,
          search: {},
          sort: {
            articleLove: -1
          }
        }
        let url = '/articlelist'
        axios.get(url, {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.hotLists = res.result
            this.hotLists.forEach((item) => {
              decodeArticle(item)
            })
          } else {
            console.log(res.msg)
          }
        })
      },
      ...mapMutations({
        setLabelArray: 'SET_LABEL_ARRAY',
        setTimeArray: 'SET_TIME_ARRAY'
      })
    },
    components: {
      VueLink,
      LabelCloud,
      AccordionList,
      LeftBorder
    }
  }
</script>


