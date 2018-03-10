<template>
  <div class="aboutme">
    <div>我的技能</div>
    <div id="radar-wrapper" class="radar-wrapper">
      <canvas id="radar" class="rader"></canvas>
      <canvas id="animate" class="animate"></canvas>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import './AboutMe.styl'
</style>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        cfg: {
          width: 300,
          // 雷达图的宽
          height: 300,
          // 雷达图的高
          name: '技能雷达图',
          data: [
            ['html/html5', 0.7],
            ['css/css3', 0.7],
            ['js', 0.75],
            ['vue', 0.7],
            ['jq', 0.7],
            ['算法与数据结构', 0.7],
            ['Stylus', 0.6],
            ['Sass', 0.5],
            ['node', 0.5],
            ['react', 0.4],
            ['webpack', 0.4],
            ['mongoDB', 0.4],
            ['linux', 0.3],
            ['git', 0.3]
          ]
        },
        canvas: null,
        ctx: null,
        // 雷达背景图的canvas和ctx
        anim: null,
        anictx: null
        // 雷达图动画的canvas和ctx
      }
    },
    mounted () {
      this.radarw = document.getElementById('radar-wrapper')
      this.canvas = document.getElementById('radar')
      this.ctx = this.canvas.getContext('2d')
      this.anim = document.getElementById('animate')
      this.anictx = this.anim.getContext('2d')
      this.Radar()
    },
    // 标签使用了keep-alive，使用activated代替mounted
    activated () {
      let s = 0
      let i = 0
      for (; i < 100; i++) {
        setTimeout(() => {
          s += 0.01
          this.draw(s)
        }, i * 10 + 500)
      }
    },
    methods: {
      Radar () {
        let w = this.cfg.width
        let h = this.cfg.height
        this.canvas.width = this.ctx.width = w
        this.canvas.height = this.ctx.height = h

        let center = w / 2
        // canvas元素的宽的一半
        let r = center * 0.8
        // 雷达图的半径
        let step = this.cfg.data.length
        // 根据技能数决定雷达图的变数
        let isBlue = false
        // 控制背景图蓝白相间
        for (let s = 10; s > 0; s--) {
          this.ctx.beginPath()
          for (let i = 0; i < step; i++) {
            let rad = (2 * Math.PI / 360) * (360 / step) * i
            // 计算每个技能的角度
            let x = center + Math.sin(rad) * r * (s / 10)
            let y = center + Math.cos(rad) * r * (s / 10)
            // 求出该技能的坐标
            this.ctx.lineTo(x, y)
          }
          this.ctx.closePath()
          this.ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff'
          // 背景蓝白相间
          this.ctx.fill()
        }
        for (let i = 0; i < step; i++) {
          let rad = (2 * Math.PI / 360) * (360 / step) * i
          let x = center + Math.sin(rad) * r
          let y = center + Math.cos(rad) * r
          this.ctx.moveTo(center, center)
          this.ctx.lineTo(x, y)
          let tx = 0
          let ty = 0
          if (x >= w / 2) {
            tx = x + 5
            // x坐标在右边，向右移
          } else {
            tx = x - 20
            // x坐标在左边，向左移
          }
          if (y >= h / 2) {
            ty = y + 10
            // y坐标在上边，向上移
          } else {
            ty = y - 10
            // y坐标在下边，向下移
          }
          if (this.cfg.data[i][2]) {
            this.ctx.fillStyle = this.cfg.data[i][2]
            // 技能数据是否有给出技能标题的颜色
          } else {
            this.ctx.fillStyle = '#fff'
          }
          this.ctx.fillText(this.cfg.data[i][0], tx, ty)
          // 渲染技能标题
        }
        this.ctx.strokeStyle = '#e0e0e0'
        this.ctx.stroke()
      },
      draw (per) {
        let w = this.cfg.width
        let h = this.cfg.height
        this.anim.width = this.anictx.width = w
        this.anim.height = this.anictx.height = h
        // 清除上一帧
        this.anictx.clearRect(0, 0, w, h)
        let step = this.cfg.data.length
        let center = w / 2
        let r = center * 0.8
        // 连接相邻技能当前坐标
        for (let i = 0; i < step; i++) {
          let rad = (2 * Math.PI / 360) * (360 / step) * i
          let rate = this.cfg.data[i][1] * per
          let x = center + Math.sin(rad) * r * rate
          let y = center + Math.cos(rad) * r * rate

          this.anictx.lineTo(x, y)
        }
        this.anictx.closePath()
        this.anictx.stroke()

        this.anictx.fillStyle = '#ff7676'
        // 在技能坐标当前位置画圆点
        for (let i = 0; i < step; i++) {
          let rad = (2 * Math.PI / 360) * (360 / step) * i
          let rate = this.cfg.data[i][1] * per
          let x = center + Math.sin(rad) * r * rate
          let y = center + Math.cos(rad) * r * rate

          this.anictx.beginPath()
          this.anictx.arc(x, y, 5, 0, 2 * Math.PI)
          this.anictx.fill()
          this.anictx.closePath()
        }
      }
    }
  }
</script>