<template>
  <div class="admin-wrapper" v-if="isAdmin">
    <div class="admin">
      <div class="left-wrapper">
        <div class="left">
          <div class="left-item" @click="turnMain()">首<br>页</div>
          <div class="left-item" :class="{active: currentItem === 1}" @click="currentItem = 1">用<br>户<br>信<br>息<br>管<br>理</div>
          <div class="left-item" :class="{active: currentItem === 2}" @click="currentItem = 2">文<br>章<br>管<br>理</div>
        </div>
      </div>
      <div class="right-wrapper">
        <div class="right">
          <users v-show="currentItem === 1"></users>
          <articles v-show="currentItem === 2"></articles>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'AdminPage.styl'
</style>

<script>
// 后台管理页面
  import Users from '@/components/Users/Users'
  import Articles from '@/components/Articles/Articles'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        currentItem: 1
        // 当前激活项
      }
    },
    computed: {
      ...mapGetters([
        'isAdmin'
      ])
    },
    methods: {
      // 跳转到主页
      turnMain () {
        this.$router.push('/mainpage')
      }
    },
    components: {
      Users,
      Articles
    }
  }
</script>
