<template>
  <div class="button-wrapper">
    <operate-button :isTurn="isTurn" :isCheck="isCheck" :isDelete="isDelete" :text="text" @check="checkUser()" @delete="deleteUser()"></operate-button>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
// 后台用户操作的基础按钮组件
  import OperateButton from '@/components/OperateButton/OperateButton'
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        text: '用户'
      }
    },
    props: {
      user: {
        type: Object,
        default: () => {}
      },
      isTurn: {
        type: Boolean,
        default: false
      },
      isCheck: {
        type: Boolean,
        default: true
      },
      isDelete: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      checkUser () {
        this.setCheckUser(this.user)
        this.setIsChecked(true)
      },
      deleteUser () {
        this.$emit('delete')
      },
      ...mapMutations({
        setCheckUser: 'SET_CHECK_USER',
        setIsChecked: 'SET_IS_CHECKED'
      })
    },
    components: {
      OperateButton
    }
  }
</script>