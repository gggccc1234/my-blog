<template>
  <div class="comment-list">
    <ul v-for="item in articleComments">
      <li class="item-wrapper">
        <!-- 评论主体 -->
        <div class="comment-content">
          <div class="content-left">
            <img v-lazy='(item.userAvatarUrl + "-minexpic") || "./avatar.png"' alt="" class="avatar-pic">
          </div>
          <div class="content-right">
            <div class="content-top">
              <div class="username">{{item.userName}}</div>
              <div class="publishtime">{{item.ptime}}</div>
            </div>
            <div class="comment-text" v-html="item.commentText"></div>
          </div>
        </div>
        <!-- 评论信息 -->
        <div class="comment-message">
          <div class="reply" style="display: none">
            <div class="ctext">回复</div>
            <img src="./reply.svg" alt="" class="cpic" width="20px" height="30px">
          </div>
          <div class="good" @click="good(item)">
            <img src="./good .svg" alt="" class="cpic" width="20px" height="30px">
            <div class="ctext">{{item.good}}</div>
          </div>
          <div class="bad" @click="bad(item)">
            <img src="./bad.svg" alt="" class="cpic" width="20px" height="30px">
            <div class="ctext">{{item.bad}}</div>
          </div>
          <div class="floor">
            <img src="./floor.svg" alt="" class="cpic" width="20px" height="30px">
            <div class="ctext">{{item.floor}}楼</div>
          </div>
          <div class="report" style="display: none">
            <div class="ctext">举报</div>
            <img src="./flag.svg" alt="" class="cpic" width="20px" height="30px">
          </div>
        </div>
        <comment-button v-if="isOperate" @delete="deleteComment(item)"></comment-button>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  @import "CommentLists.styl"
</style>

<script type="text/ecmascript-6">
// 评论列表组件
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  import storage from 'good-storage'
  import {storageKey} from '@/common/js/config'
  import {loginMixin} from '@/common/js/mixin'
  import CommentButton from '@/components/CommentButton/CommentButton'

  export default {
    mixins: [loginMixin],
    props: {
      // 评论列表内容
      articleComments: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 控制是否后台模式
      isOperate: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'currentArticle'
      ])
    },
    methods: {
      // 删除评论
      deleteComment (item) {
        let param = {
          articleId: item.articleId,
          userId: item.userId,
          floor: item.floor
        }
        axios.get('articlelist/deletecomment', {
          params: param
        }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.$emit('comment')
          }
        })
      },
      // 给评论点赞
      good (item) {
        if (!this.loginSuccess) {
          alert('您还没有登录')
          this.isOp()
          return
        }
        let userId = item.userId
        let articleId = item.articleId
        let floor = item.floor
        let good = item.good
        let keyGood = storageKey + userId + '_' + articleId + '_' + floor + '_good'
        if (storage.has(keyGood) && storage.get(keyGood)) {
          alert('你已经点过赞了')
        } else {
          storage.set(keyGood, true)
          let param = {
            userId: userId,
            articleId: articleId,
            floor: floor,
            good: good
          }
          axios.get('/users/good', {
            params: param
          }).then((response) => {
            let res = response.data
            if (res.status === '0') {
              item.good++
            } else {
              console.log(res.msg)
            }
          })
        }
      },
      // 给评论点踩
      bad (item) {
        if (!this.loginSuccess) {
          alert('您还没有登录')
          this.isOp()
          return
        }
        let userId = item.userId
        let articleId = item.articleId
        let floor = item.floor
        let bad = item.bad
        let keyBad = storageKey + userId + '_' + articleId + '_' + floor + '_bad'
        if (storage.has(keyBad) && storage.get(keyBad)) {
          alert('你已经点过踩')
        } else {
          storage.set(keyBad, true)
          let param = {
            userId: userId,
            articleId: articleId,
            floor: floor,
            bad: bad
          }
          axios.get('/users/bad', {
            params: param
          }).then((response) => {
            let res = response.data
            if (res.status === '0') {
              item.bad++
            } else {
              console.log(res.msg)
            }
          })
        }
      }
    },
    components: {
      CommentButton
    }
  }
</script>

