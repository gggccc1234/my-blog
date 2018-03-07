<template>
  <form class="login-box">
    <div class="message" v-text="messageText"></div>
    <div class="line"></div>
    <label class="username-wrapper"><div class="text">用户名：</div><input class="username" type="text" name="username" v-model="userName"></label>
    <div class="line"></div>
    <label class="password-wrapper"><div class="text">密码：</div><input class="password" type="password" name="password" v-model="passWord"></label>
    <div class="line"></div>
    <div class="remember" v-show="!isRegister">
      <label class="remember-box"><div class="retext" @click.stop="isReUn()" :class="{'isre':isRememberUsername}">记住用户名</div><input type="checkbox" class="checkbox" name="remember"></label>
      <label class="remember-box"><div class="retext" @click.stop="isRePw()" :class="{'isre':isRememberPassword}">记住密码</div><input type="checkbox" class="checkbox" name="remember"></label>
    </div>
    <label class="ymail-wrapper" v-show="isRegister"><div class="text">邮箱：</div><input class="ymail" type="text" name="ymail" v-model="userEmail"></label>
    <div class="line"></div>
    <label class="register-wrapper" @click.stop="Register()"><div class="register"><span v-show="!isRegister">没有账号？现在去注册</span><span v-show="isRegister">注册成功？现在去登录</span></div></label>
    <div class="line"></div>
    <label class="yzm-wrapper">
      <span @click="newYZM()"><yan-zheng-ma ref="yzm" @yzm="setYZM"></yan-zheng-ma></span><span class="yzm"><input type="text" v-model="yzmText" placeholder="请输入验证码" class="yzm-input"></span>
    </label>
    <div class="line"></div>
    <label class="submit-wrapper" @click.stop.prevent="Login"><input class="submit" type="submit" name="登录"></label>
    <div class="line"></div>
    <div class="return" @click.stop="isFa()"><img src="./cross.svg" alt="" width="20px" height="20px"></div>
  </form>
</template>

<style lang="stylus" scoped>
  @import 'Login.styl'
</style>

<script type="text/ecmascript-6">
// 登陆组件
  import axios from 'axios'
  import storage from 'good-storage'
  import {loginMixin} from '@/common/js/mixin'
  import {storageKey} from '@/common/js/config'
  import YanZhengMa from '@/components/YanZhengMa/YanZhengMa'
  import xss from 'xss'
  import {isPassword, isEmail} from '@/common/js/util'

  export default {
    mixins: [loginMixin],
    data () {
      return {
        isRememberUsername: false,
        // 是否记住用户名
        isRememberPassword: false,
        // 是否记住密码
        isRegister: false,
        // 是否切换注册
        userName: '',
        // 用户名
        passWord: '',
        // 密码
        userEmail: '',
        // 用户邮箱
        messageText: '欢迎登录陈彦锋的博客',
        // 提示信息
        yzmText: '',
        // 用户输入验证码
        yzmT: ''
        // 系统生成验证码
      }
    },
    mounted () {
      this.ResetMessage()
    },
    methods: {
      // 重置输入信息
      ResetMessage () {
        // 从localstorage获取记录的用户名和密码
        let keyUserName = storageKey + 'username'
        if (storage.has(keyUserName)) {
          this.userName = storage.get(keyUserName)
        }
        let keyUserPassWord = storageKey + 'password'
        if (storage.has(keyUserPassWord)) {
          this.passWord = storage.get(keyUserPassWord)
        }
      },
      Login () {
        if (!this.userName || !this.passWord) {
          alert('信息不齐全')
          return null
        }
        if (!this.userName.length > 20) {
          alert('用户名最长为20个字节，即10个汉字')
          return null
        }
        if (!isPassword(this.passWord)) {
          alert('密码长度为6-16位的数字，大小写字母')
          return null
        }
        this.userName = escape(xss(this.userName))
        this.passWord = escape(xss(this.passWord))
        // 防止xss
        if (!this.isRegister) {
          // 判断验证码是否正确
          // if (this.yzmText !== this.yzmT) {
          //   alert('验证码错误')
          //   this.newYZM()
          //   return
          // }
          axios.post('/users/list', {
            username: this.userName,
            password: this.passWord
          }).then((response) => {
            let res = response.data
            if (res.status === '2' || res.status === '1') {
              this.message = res.msg
            } else if (res.status === '0') {
              this.setCurrentUser(res.result)
              this.setLoginSuccess(true)
              if (this.isRememberUsername) {
                // 存储用户名到localstorage
                let keyUserName = storageKey + 'username'
                storage.set(keyUserName, res.result.userName)
              }
              if (this.isRememberPassword) {
                // 存储密码到localstorage
                let keyUserPassWord = storageKey + 'password'
                storage.set(keyUserPassWord, this.passWord)
              }
              alert('恭喜' + res.result.userName + '登录成功')
              this.isFa()
            }
          })
        } else {
          // 验证信息
          if (!isEmail(this.userEmail)) {
            alert('邮箱格式错误')
            return null
          }
          this.userEmail = encodeURIComponent(xss(this.userEmail))
          if (!this.userName || !this.passWord || !this.userEmail) {
            this.messageText = '您所填写的信息不完整'
            return null
          }
          axios.post('/users/register', {
            username: this.userName,
            password: this.passWord,
            useremail: this.userEmail
          }).then((response) => {
            alert('恭喜注册成功')
            this.isRegister = false
          })
        }
      },
      Register () {
        this.isRegister = !this.isRegister
      },
      isReUn () {
        this.isRememberUsername = !this.isRememberUsername
      },
      isRePw () {
        this.isRememberPassword = !this.isRememberPassword
      },
      newYZM () {
        this.$refs.yzm.newYZM()
      },
      setYZM (str) {
        this.yzmT = str
      }
    },
    watch: {
      isRegister (newValue) {
        if (!newValue) {
          this.ResetMessage()
        } else {
          this.userName = ''
          this.passWord = ''
        }
      },
      isLogin (newVal) {
        if (newVal) {
          this.newYZM()
        }
      }
    },
    components: {
      YanZhengMa
    }
  }
</script>

