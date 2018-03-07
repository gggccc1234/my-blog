<template>
  <div class="user-lists">
    <ul v-for="(item, index) in userLists">
      <li class="user-item">
        <div class="user-wrapper">
          <div class="user-left">
            <img :src="item.userAvatarUrl" alt="" width="200px" height="200px">
          </div>
          <div class="line"></div>
          <div class="user-right">
            <div class="right-item">用户名：{{item.userName}}</div>
            <div class="right-item">用户邮箱：{{item.userEmail}}</div>
            <div class="right-item">用户个人网站：{{item.userLink}}</div>
            <div class="right-item">用户github：{{item.userGithub}}</div>
            <div class="right-item">用户签名：{{item.userDescription}}</div>
          </div>
        </div>
        <div class="button-wrapper">
          <user-button :user="item" @delete="deleteUser(item)"></user-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'UserLists.styl'     
</style>

<script  type="text/ecmascript-6">
// 用户列表组件
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import UserButton from '@/components/UserButton/UserButton'
  import {decodeUser} from '@/common/js/util'

  export default {
    data () {
      return {
        userLists: []
      }
    },
    mounted () {
      this.getUserLists()
    },
    computed: {
      ...mapGetters([
        'page',
        'currentUser'
      ])
    },
    methods: {
      getUserLists () {
        let param = {
          page: this.page,
          pageSize: 10,
          search: {},
          sort: {
            userId: -1
          }
        }
        axios.get('/users/all', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.userLists = res.result
            this.userLists.forEach((item) => {
              decodeUser(item)
            })
          } else {
            console.log(res.msg)
          }
        })
      },
      deleteUser (item) {
        let userId = item.userId
        if (this.currentUser.userId === userId) {
          alert('当前用户正在登录中，你不能删除此自己！！！')
          return null
        }
        let param = {
          userId: userId
        }
        axios.get('/users/delete', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.userLists = this.userLists.filter((item) => {
              return item.userId !== userId
            })
          } else {
            console.log(res.msg)
          }
        })
      }
    },
    components: {
      UserButton
    }
  }
</script>

