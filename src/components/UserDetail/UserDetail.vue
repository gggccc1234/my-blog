<template>
  <div class="user-detail">
    <form class="user-form" id="user-form">
      <label class="userwrapper">
        <div class="user-text">用户昵称：长度少于20个字符，即十个汉字</div>
        <input class="username" type="text" v-model="userName" name="userName">
      </label>
      <label class="userwrapper">
        <div class="user-text">用户邮箱：</div>
        <input class="useremail" type="text" v-model="userEmail" name="userEmail">
      </label>
      <label class="userwrapper">
        <div class="user-text">用户个人网站链接：</div>
        <input class="userlink" type="text" v-model="userLink" name="userLink">
      </label>
      <label class="userwrapper">
        <div class="user-text">用户github：</div>
        <input class="usergithub" type="text" v-model="userGithub" name="userGithub">
      </label>
      <label class="useravatarurl-wrapper">
        <div class="user-text">用户头像：建议上传宽高比为1：1的图片</div>
        <input class="useravatarurl" type="file" name="avatar" id="user-avatar">
        <div class="pic-wrapper">
          <img v-lazy="this.userAvatarUrl" alt="" id="user-pic" class="pic-box">
        </div>
      </label>
      <label class="userdescription-wrapper">
        <div class="user-text">用户签名：长度少于200个字符，即100个汉字</div>
        <textarea class="userdescription" type="text" v-model="userDescription" rows="10" cols="5" name="userDescription"></textarea>
      </label>
      <div class="user-button-wrapper">
        <input type="button" class="user-reset" name="reset" value="重置" @click="formReset()">
        <input type="submit" class="user-submit" name="修改" @click.stop.prevent="revise()">
      </div>
    </form>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'UserDetail.styl'
</style>

<script type="text/ecmascript-6">
// 后台修改用户详情组件
  import {loginMixin} from '@/common/js/mixin'
  import axios from 'axios'
  import {mapGetters, mapMutations} from 'vuex'
  import {isEmail, isLink, isPicture} from '@/common/js/util'
  import xss from 'xss'

  export default {
    mixins: [loginMixin],
    data () {
      return {
        userName: '',
        userEmail: '',
        userDescription: '',
        userLink: '',
        userGithub: '',
        userAvatarUrl: '',
        user: null,
        check: false,
        oFileReader: null,
        oPreview: null,
        oUpload: null
      }
    },
    computed: {
      ...mapGetters([
        'checkUser',
        'isChecked'
      ])
    },
    created () {
      if (!this.loginSuccess) {
        this.$router.push('/mainpage')
      }
      this.setUserData()
    },
    mounted () {
      this.user = document.getElementById('user-form')
      this.oFileReader = new FileReader()
      this.oPreview = document.getElementById('user-pic')
      this.oUpload = document.getElementById('user-avatar')
      this.oFileReader.onload = this.fileOnload
      this.oUpload.onchange = this.loadChange
    },
    methods: {
      // 上传图片预览
      fileOnload (event) {
        this.oPreview.src = event.target.result
      },
      loadChange () {
        var oFile = this.oUpload.files[0]
        if (!oFile.type) {
          return null
        }
        if (!isPicture(oFile.type)) {
          alert('必须上传图片文件！')
          return null
        }
        // 上传本地图片后，从本地读取图片预览
        if (window.FileReader) {
          this.oFileReader.readAsDataURL(oFile)
        } else if (navigator.appName === 'Microsoft Internet Explorer') {
          // 根据bom对象判断浏览器类型
          this.oPreview.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
          this.oPreview.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = this.oUpload.value
        }
      },
      setUserData () {
        if (this.isChecked) {
          this.userName = this.checkUser.userName
          this.userEmail = this.checkUser.userEmail
          this.userDescription = this.checkUser.userDescription || '你还没有填写签名哦~'
          this.userLink = this.checkUser.userLink || '你还没有填写个人网站哦~'
          this.userGithub = this.checkUser.userGithub || '你还没有填写github哦~'
          this.userAvatarUrl = this.checkUser.userAvatarUrl || './avatar.jpg'
        } else {
          this.userName = this.currentUser.userName
          this.userEmail = this.currentUser.userEmail
          this.userDescription = this.currentUser.userDescription || '你还没有填写签名哦~'
          this.userLink = this.currentUser.userLink || '你还没有填写个人网站哦~'
          this.userGithub = this.currentUser.userGithub || '你还没有填写github哦~'
          this.userAvatarUrl = this.currentUser.userAvatarUrl || './avatar.jpg'
        }
      },
      formReset () {
        this.userFormDom.reset()
      },
      revise () {
        if (this.userName.length === 0) {
          alert('用户名不能为空')
          return null
        }
        if (this.userName.length > 20) {
          alert('用户名长度过长')
          return null
        }
        if (!isEmail(this.userEmail)) {
          alert('你的邮箱格式不对')
          return null
        }
        if (this.userLink != null && !isLink(this.userLink)) {
          alert('你的个人网站格式不对')
          return null
        }
        if (this.userDescription != null && this.userDescription.length > 100) {
          alert('用户签名长度过长')
          return null
        }
        var oFile = this.oUpload.files[0]
        if (oFile.type && !isPicture(oFile.type)) {
          alert('必须上传图片文件！')
          return null
        }
        // 修改个人信息
        var formdData = new FormData(this.user)
        formdData.append('userId', this.currentUser.userId)
        formdData.append('userAvatarUrl', this.currentUser.userAvatarUrl)
        formdData.append('userName', escape(xss(this.userName)))
        formdData.append('userEmail', encodeURIComponent(xss(this.userEmail)))
        formdData.append('userLink', encodeURIComponent(xss(this.userLink)))
        formdData.append('userGithub', encodeURIComponent(xss(this.userGithub)))
        formdData.append('userDescription', escape(xss(this.userDescription)))
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('/users/edit', formdData, config).then((response) => {
          let res = response.data
          if (res.status === '0') {
            if (this.isChecked) {
              this.setCheckUser(res.result)
            } else {
              this.setCurrentUser(res.result)
            }
            alert('修改成功')
            console.log(res.result)
            this.$router.push('/mainpage')
          } else {
            alert(res.msg)
          }
        })
      },
      ...mapMutations({
        setCheckUser: 'SET_CHECK_USER'
      })
    },
    watch: {
      currentUser (newValue) {
        if (!this.isChecked) {
          this.setUserData()
        }
      },
      checkUser (newValue) {
        if (this.isChecked) {
          this.setUserData()
        }
      }
    }
  }
</script>

