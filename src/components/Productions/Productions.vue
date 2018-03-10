<template>
  <div>
    <ul v-for="(item,index) in prodata" class="box">
      <li class="item">
        <ul class="item-wrapper">
          <li class="proname">{{item.proname}}</li>
          <li class="propic">
            <img v-lazy="item.propic" width="100%">
          </li>
          <li class="prolink"><a @click.prevent="openWin(item.prolink)"><span>预览地址：</span>{{item.prolink}}</a></li>
          <li class="progithub"><a @click.prevent="openWin(item.progithub)"><span>GitHub：</span>{{item.progithub}}</a></li>
          <li class="proarticle"><a @click.prevent="openWin(item.proarticle)"><span>文章详情：</span>{{item.proarticle}}</a></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  @import './Production.styl'
</style>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        prodata: [
          {
            propic: '../static/img/1.png',
            prolink: 'http://www.chenyanfeng.cn',
            proarticle: '',
            progithub: 'https://github.com/guichuju/my-blog',
            proname: '个人博客'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/responsive/',
            proarticle: '',
            progithub: 'https://github.com/guichuju/responsive',
            proname: '响应式页面'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/componentcharts/',
            proarticle: '',
            progithub: 'https://github.com/guichuju/componentcharts',
            proname: '图表组件'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/jquerycalendar/',
            proarticle: '',
            progithub: 'https://github.com/guichuju/jquerycalendar',
            proname: '日程备忘录'
          }, {
            propic: '../static/img/1.png',
            prolink: 'http://music.chenyanfeng.cn',
            proarticle: '',
            progithub: 'https://github.com/guichuju/vue-music-spa',
            proname: '移动端音乐app'
          }, {
            propic: '../static/img/1.png',
            prolink: 'http://shop.chenyanfeng.cn',
            proarticle: '',
            progithub: 'https://github.com/guichuju/vue-shop-master',
            proname: 'PC端商城'
          }, {
            propic: '../static/img/1.png',
            prolink: 'http://sell.chenyanfeng.cn',
            proarticle: '',
            progithub: 'https://github.com/guichuju/vue-sell-spa',
            proname: '移动端外卖商城'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/2048/index.html',
            proarticle: '',
            progithub: 'https://github.com/guichuju/2048',
            proname: '2048小游戏'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/loveFish/',
            proarticle: '',
            progithub: 'https://github.com/guichuju/loveFish',
            proname: '爱心鱼小游戏'
          }, {
            propic: '../static/img/1.png',
            prolink: 'https://guichuju.github.io/wuziqi/',
            proarticle: '',
            progithub: 'https://github.com/guichuju/wuziqi',
            proname: '简单五子棋'
          }
        ]
      }
    },
    methods: {
      openWin (url) {
        window.open(url)
      }
    }
  }
</script>