<template>
  <div class="label-manage">
    <ul v-for="item in labelArray">
      <li class="label-item">
        <div class="label-name"><span class="ltext">标签名为：</span>{{item.name}}</div>
        <div class="label-num"><span class="ltext">当前包含该标签的文章共有</span>{{item.num}}篇</div>
        <div class="delete-label" @click="removeLabel(item.name)">
          <img class="delete-label" src="./cross.svg" alt="" width="20px" height="40px">
        </div>
      </li>
    </ul>
    <div class="add-label" @click="addLabel()">
      <img src="./add.svg" alt="" width="20px" height="40px">
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'LabelManage.styl'
</style>

<script type="text/ecmascript-6">
// 后台标签管理页面
  import axios from 'axios'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data () {
      return {
        labelName: ''
      }
    },
    computed: {
      ...mapGetters([
        'labelArray'
      ])
    },
    methods: {
      // 新增标签
      addLabel () {
        this.labelName = prompt('请输入新的标签名：', '')
        if (this.labelName !== null && this.labelName !== '') {
          let param = {
            name: this.labelName
          }
          axios.get('/label/add', {
            params: param
          }).then((response) => {
            let res = response.data
            if (res.status === '0') {
              this.pushLabelArray(res.result)
            } else {
              alert(res.msg)
            }
          })
        }
      },
      // 删除标签
      removeLabel (name) {
        let ret = confirm('您确定要删除该标签吗？包含该标签的所有文章都会被除去该标签，可能会导致文章被标为未分类！！！')
        if (!ret) {
          return
        }
        let param = {
          name: name
        }
        axios.get('/label/remove', {
          params: param
        }).then((response) => {
          let res = response.data
          let newLA = this.labelArray.slice(0)
          newLA = newLA.filter((item) => {
            return item.name !== name
          })
          this.setLabelArray(newLA)
          alert(res.msg)
        })
      },
      ...mapMutations({
        setLabelArray: 'SET_LABEL_ARRAY',
        pushLabelArray: 'PUSH_LABEL_ARRAY'
      })
    }
  }
</script>
