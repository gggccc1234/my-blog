<template>
  <div class="article-detail">
    <form class="edit-form" id="edit-form">
      <label class="edit-title-wrapper">
        <div class="edit-text">文章题目：</div>
        <input type="text" class="edit-title" v-model="editTitle" name="articleTitle">
      </label>
      <div class="edit-label-wrapper clearfix">
        <div class="edit-text">文章分类：</div>
        <div class="label-box">
          <div v-for="item in labelArray">
            <label class="label-wrapper">
              <span class="label-text">{{item.name}}</span>
              <div class="check-box">
                <input type="checkbox" name="label" :value="item.name" class="labelinput">
              </div>
            </label>
          </div>
        </div>
      </div>
      <br>
      <label class="edit-summary-wrapper">
        <div class="edit-text">文章简介：</div>
        <textarea cols="10" rows="10" class="edit-summary" v-model="editSummary" name="articleSummary"></textarea>
      </label>
      <label class="edit-avatar-wrapper">
        <div class="edit-text">文章封面：建议上传宽高比为2：1的照片</div>
        <input type="file" class="edit-avatar" name="avatar" id="edit-avatar">
        <div class="pic-wrapper">
          <img :src="this.editAvatar" alt="" id="edit-pic" class="pic-box">
        </div>
      </label>
      <label class="editorElem-wrapper">
        <div class="edit-text">文章正文：</div>
        <div id="editorElem" class="editorElem"></div>
      </label>
      <div class="edit-button-wrapper">
        <div class="edit-draft" @click="publish(1)">存入草稿箱</div>
        <input type="submit" class="edit-submit" name="发表" value="发表" @click.stop.prevent="publish(0)" v-show="!isRepair">
        <input type="submit" class="edit-submit" name="转到查看模式" value="转到查看模式" @click.stop.prevent="toggleModel()" v-show="!isRepair">
        <input type="submit" class="edit-submit" name="修改" value="修改" @click.stop.prevent="publish(2)" v-show="isRepair">
        <input type="submit" class="edit-submit" name="转到投稿模式" value="转到投稿模式" @click.stop.prevent="toggleModel()" v-show="isRepair">
        <div class="edit-delete">删除</div>
      </div>
    </form>
  </div>
</template>

<style lang="stylus" scoped>
  @import 'ArticleDetail.styl'
</style>

<script type="text/ecmascript-6">
// 发表和修改文章页
  import E from 'wangeditor'
  // 富文本编辑器插件
  import axios from 'axios'
  import {loginMixin, getDetailMixin} from '@/common/js/mixin'
  import {mapGetters} from 'vuex'
  import {isPicture} from '@/common/js/util'
  import xss from 'xss'

  export default {
    name: 'editor',
    mixins: [loginMixin, getDetailMixin],
    data () {
      return {
        editorContent: '',
        editTitle: '',
        editLabel: '',
        editSummary: '',
        editAvatar: '',
        edit: null,
        isRepair: false,
        articleId: '',
        publishTime: '',
        oFileReader: null,
        oPreview: null,
        oUpload: null,
        editor: null
      }
    },
    computed: {
      ...mapGetters([
        'labelArray',
        'currentUser',
        'currentArticle'
      ])
    },
    created () {
      if (!this.loginSuccess) {
        this.$router.push('/mainpage')
      }
    },
    methods: {
      // 预览上传的本地图片
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
        if (window.FileReader) {
          this.oFileReader.readAsDataURL(oFile)
        } else if (navigator.appName === 'Microsoft Internet Explorer') {
          // 通过navigation的值判断浏览器的类型
          this.oPreview.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
          this.oPreview.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = this.oUpload.value
        }
      },
      resetNew () {
        this.editorContent = ''
        this.editTitle = ''
        this.editLabel = ''
        this.editSummary = ''
        this.editAvatar = ''
        this.articleId = ''
        this.publishTime = ''
        this.setLabelMessage()
      },
      renderData () {
        this.editorContent = this.returnArticleDetail().articleContent
        this.editor.$textElem[0].innerHTML = this.editorContent
        this.editTitle = this.currentArticle.articleTitle
        this.editLabel = this.currentArticle.articleLabels
        this.editSummary = this.currentArticle.articleSummary
        this.editAvatar = this.currentArticle.articleAvatarUrl
        this.articleId = this.currentArticle.articleId
        this.publishTime = this.currentArticle.publishTime
        this.setLabelMessage()
      },
      // 切换发表模式和修改模式
      toggleModel () {
        if (this.currentArticle.articleId === undefined || this.currentArticle.articleId === null || this.currentArticle.articleId === '') {
          alert('请先选定一篇文章，然后才能查看')
          return null
        }
        this.isRepair = !this.isRepair
        if (this.isRepair) {
          this.renderData()
        } else {
          this.resetNew()
        }
      },
      // 使用formdata发送数据
      publish (publish) {
        let articleLabels = this.labelmessage()
        var formdData = new FormData(this.edit)
        formdData.append('articleContent', this.editorContent)
        formdData.append('userId', this.currentUser.userId)
        formdData.append('userName', escape(xss(this.currentUser.userName)))
        formdData.append('userAvatarUrl', this.currentUser.userAvatarUrl)
        formdData.append('articleLabels', articleLabels)
        formdData.append('publish', publish)
        formdData.append('articleAvatarUrl', this.editAvatar)
        formdData.append('articleId', this.articleId)
        formdData.append('publishTime', this.publishTime)
        formdData.append('articleTitle', escape(xss(this.editTitle)))
        formdData.append('articleSummary', escape(xss(this.editSummary)))
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        console.log(1111)
        axios.post('/articlelist/edit', formdData, config).then((response) => {
          let res = response.data
          console.log(2222)
          if (res.status === '0' || res.status === 0) {
            console.log(3333)
            console.log('成功')
          } else {
            console.log(4444)
            console.log(res.msg)
          }
          this.$router.push('/mainpage')
        })
      },
      // 获取checkbox中被选中的标签
      labelmessage () {
        let label = this.edit.label
        let arr = []
        for (let i = 0; i < label.length; i++) {
          if (label[i].checked) {
            arr.push({
              labelName: label[i].value
            })
          }
        }
        let obj = JSON.stringify({arr: arr})
        return obj
      },
      // 渲染选中的标签
      setLabelMessage () {
        let label = this.edit.label
        for (let i = 0; i < label.length; i++) {
          label[i].checked = ''
        }
        for (let i = 0; i < this.editLabel.length; i++) {
          for (let j = 0; j < label.length; j++) {
            if (label[j].value === this.editLabel[i].labelName) {
              label[j].checked = 'checked'
            }
          }
        }
      }
    },
    mounted () {
      this.editor = new E('#editorElem')
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        // 'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        // 'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      this.editor.create()
      this.edit = document.getElementById('edit-form')
      this.oFileReader = new FileReader()
      this.oPreview = document.getElementById('edit-pic')
      this.oUpload = document.getElementById('edit-avatar')
      this.oFileReader.onload = this.fileOnload
      this.oUpload.onchange = this.loadChange
    },
    watch: {
      // 监听当前选中文章变化
      currentArticle (newVal) {
        if (newVal !== null && newVal !== undefined && newVal !== {}) {
          this.getArticleDetail(newVal.articleId)
          // 当前处于修改模式则把新数据渲染到页面
          console.log(this.articleDetail)
          if (this.isRepair) {
            this.setLabelMessage()
          }
        }
      }
    }
  }
</script>

