<template>
  <div class="canvas-wrapper" id="canvas-wrapper">
    <div class="c-wrapper">
      <canvas class="canvas" id="canvas"></canvas>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .canvas-wrapper
    width: 120px
    height: 50px
    z-index: 100000
    background: #fff
    display: inline-block
    position: relative
    .c-wrapper
      position: absolute
      top: 0
      left: 0
      width: 120px
      height: 50px
      display: inline-block
      z-index: 900000
</style>

<script type="text/ecmascript-6">
  import {hanzhi} from '@/common/js/hanzhi'

  export default {
    data () {
      return {
        canvas: null,
        // canvas的dom节点
        ctx: null,
        // canvas绘图环境
        text: [],
        // canvas的dom节点数组
        ctxtext: [],
        // canvas绘图环境数组
        data: [],
        box_x: null,
        // canvas的宽度
        box_y: null,
        // canvas的长度
        tx: [0, 0, 0, 0],
        // translateX 水平平移
        ty: [0, 0, 0, 0],
        // translateY 垂直平移
        sx: [1, 1, 1, 1],
        // scallX 水平缩放
        sy: [1, 1, 1, 1],
        // scallY 垂直缩放
        rt: [0, 0, 0, 0],
        // rotate 旋转角度
        kx: [0, 0, 0, 0],
        // knewX 水平扭曲
        ky: [0, 0, 0, 0],
        // knewY 垂直扭曲
        deg: [10, 7, 4, 2],
        // 旋转，扭曲的调整参数
        hanzhiLen: 0,
        // 字库的长度
        cw: null
        // canvas外壳的父节点
      }
    },
    mounted () {
      // 初始化canvas环境
      this.cw = document.getElementById('canvas-wrapper')
      this.box_x = this.cw.clientWidth
      this.box_y = this.cw.clientHeight
      this.canvas = document.getElementById('canvas')
      this.canvas.width = this.box_x
      this.canvas.height = this.box_y
      this.ctx = this.canvas.getContext('2d')
      for (let i = 0; i < 4; i++) {
        this.text[i] = document.createElement('canvas')
        this.ctxtext[i] = this.text[i].getContext('2d')
        this.text[i].width = this.box_x
        this.text[i].height = this.box_y
      }
      this.hanzhiLen = hanzhi.length
    },
    methods: {
      // 生成新的验证码
      newYZM () {
        this.box_x = this.cw.clientWidth
        this.box_y = this.cw.clientHeight
        this.canvas.width = this.box_x
        this.canvas.height = this.box_y
        for (let i = 0; i < 4; i++) {
          this.text[i].width = this.box_x
          this.text[i].height = this.box_y
        }
        let grad = this.ctx.createLinearGradient(0, 0, this.box_x, this.box_y)
        grad.addColorStop(0, `rgb(${this.rand(100, 170)},${this.rand(100, 170)},${this.rand(100, 170)})`)
        grad.addColorStop(1, `rgb(${this.rand(100, 250)},${this.rand(100, 250)},${this.rand(100, 250)})`)
        // 创建线性渐变
        this.ctx.fillStyle = grad
        this.ctx.fillRect(0, 0, this.box_x, this.box_y)
        // 清空屏幕
        this.data = []
        for (let i = 0; i < 4; i++) {
          let r = this.rand(this.hanzhiLen)
          if (r !== 0) {
            r--
          }
          this.data.push(hanzhi[r])
        }
        // 随机取4个汉字
        for (let i = 0; i < 4; i++) {
          let tLX = this.rand(-this.box_x * 0.03 - this.tx[i], this.box_x * 0.03 - this.tx[i])
          this.tx[i] += tLX
          let tLY = this.rand(-this.box_y * 0.03 - this.ty[i], this.box_y * 0.03 - this.ty[i])
          this.ty[i] += tLY
          let sCX = this.rand(0.8 / this.sx[i], 1.2 / this.sx[i], 1)
          this.sx[i] *= sCX
          let sCY = this.rand(0.8 / this.sy[i], 1.2 / this.sy[i], 1)
          this.sy[i] *= sCY
          let rTT = this.rand(-this.deg[i] - this.rt[i], this.deg[i] - this.rt[i])
          this.rt[i] += rTT
          rTT = rTT * Math.PI / 180
          let sKX = this.rand(-this.deg[i] - this.kx[i], this.deg[i] - this.kx[i])
          this.kx[i] += sKX
          sKX = sKX * Math.PI / 180
          let sKY = this.rand(-this.deg[i] - this.ky[i], this.deg[i] - this.ky[i])
          this.ky[i] += sKY
          sKY = sKY * Math.PI / 180
          // 对每个字体canvas随机变换
          this.ctxtext[i].translate(tLX, tLY)
          this.ctxtext[i].rotate(rTT)
          this.ctxtext[i].scale(sCX, sCY)
          this.ctxtext[i].transform(1, sKX, sKY, 1, 0, 0)
          this.ctxtext[i].font = `25px Verdana`
          let gradient = this.ctxtext[i].createLinearGradient(0, 0, this.box_x, this.box_y)
          for (let i = 0; i <= 1; i += 0.25) {
            gradient.addColorStop(i, `rgb(${this.rand(0, 100)},${this.rand(0, 100)},${this.rand(0, 100)})`)
          }
          this.ctxtext[i].strokeStyle = gradient
          this.ctxtext[i].strokeText(this.data[i], 10 + 25 * i, 35)
          this.ctx.drawImage(this.text[i], 0, 0)
          // 在canvas填充另一个canvas
        }
        let line = this.rand(7, 10)
        for (let i = 0; i < line; i++) {
          this.ctx.beginPath()
          // 开始画图
          this.ctx.moveTo(this.rand(120), this.rand(50))
          this.ctx.quadraticCurveTo(this.rand(120), this.rand(50), this.rand(120), this.rand(50))
          let gradient = this.ctx.createLinearGradient(0, 0, this.box_x, this.box_y)
          gradient.addColorStop(0, `rgb(${this.rand(0, 100)},${this.rand(0, 100)},${this.rand(0, 100)})`)
          gradient.addColorStop(1, `rgb(${this.rand(0, 200)},${this.rand(0, 200)},${this.rand(0, 200)})`)
          // 线性渐变
          this.ctx.strokeStyle = gradient
          this.ctx.stroke()
          // 绘制
        }
        let str = ''
        for (let i = 0; i < this.data.length; i++) {
          str = str + this.data[i]
        }
        this.$emit('yzm', str)
      },
      // 随机生成一个min到max之间的数
      rand (max, min, flag) {
        if (min === undefined || min === null || min === '') {
          min = 0
        }
        if (flag === 1) {
          return (max - min + 0.1) * Math.random() + min
        }
        return Math.floor((max - min + 1) * Math.random() + min)
      }
    }
  }
</script>


