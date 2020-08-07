<template>
  <div id="app">
    <canvas id="canvas"></canvas>

    <div class="operate-bar">
      <el-select v-model="choosePoint" @change="linkPoint" size="small" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>

      <el-button class="clear-btn" @click="redraw" size="small" type="danger">清除</el-button>

      <el-button class="clear-btn" @click="movaAlongLine(1)" size="small" type="primary">线路1</el-button>
      <el-button class="clear-btn" @click="movaAlongLine(2)" size="small" type="primary">线路2</el-button>
      <el-button class="clear-btn" @click="movaAlongLine(3)" size="small" type="primary">线路3</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nodes: [
          { type: 1, coordination: [200, 200] },
          { type: 1, coordination: [250, 250] },
          { type: 1, coordination: [300, 300] },
          { type: 1, coordination: [300, 600] },
          { type: 1, coordination: [400, 600] },
          { type: 2, coordination: [500, 650] },
          { type: 2, coordination: [700, 250] },
          { type: 2, coordination: [900, 600] },
          { type: 2, coordination: [900, 250] },
          { type: 2, coordination: [1000, 200] }
        ],

        options: [
          { label: '点1', value: 0 },
          { label: '点2', value: 2 },
          { label: '点3', value: 3 },
          { label: '点4', value: 4 },
          { label: '点5', value: 5 },
          { label: '点6', value: 6 },
          { label: '点7', value: 7 },
          { label: '点8', value: 8 },
          { label: '点9', value: 9 },
          { label: '点10', value: 10 }
        ],

        recurringFlag: null, // 记录循环的id，用于取消循环
        choosePoint: null, // 要连接其它所有点的index

        canvasWidth: 1200,
        canvasHeight: 700,

        lineIndex: 1, // 图片运行线路index
        imgLocal: [] // 图片位置坐标
      }
    },
    methods: {
      linkPoint(index) {
        const originPoint = this.nodes[index]
        const ctx = document.getElementById('canvas').getContext('2d')

        this.nodes.forEach((item, idx) => {
          if (idx !== index) {
            ctx.strokeStyle = '#1E90FF' // 线段颜色
            ctx.beginPath()
            ctx.moveTo(originPoint.coordination[0], originPoint.coordination[1])
            ctx.lineTo(item.coordination[0], item.coordination[1])
            ctx.stroke()
            ctx.closePath()
          }
        })
      },

      redraw() {
        var canvas = document.getElementById('canvas') //获得画布
        var ctx = canvas.getContext('2d') //注意：2d小写， 3d：webgl

        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        this.drawBgc(canvas)
        this.drawPoints(ctx, this.nodes)
      },
      /** 描绘点
       * nodes: 所有要描绘的点的坐标集合
       * pointColor: 点的颜色
       * radius: 点的半径大小
       */
      drawPoints(ctx, nodes, pointColor = '#7B68EE', radius = 10) {
        // todo: 坐标点需要添加类型属性，用于分辨商家和客户，描绘点时根据此属性选择颜色

        nodes.forEach(item => {
          ctx.fillStyle = item.type === 1 ? pointColor : '#FFA500' // 点的颜色
          ctx.beginPath()
          ctx.arc(item.coordination[0], item.coordination[1], radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.closePath()
        })
      },
      /** 描绘线
       * nodes: 线两端点的集合
       * lineColor: 线条颜色
       */
      drawPaths(ctx, nodes, lineColor = '#1E90FF') {
        nodes.reduce((pre, cur, index, arr) => {
          ctx.strokeStyle = lineColor // 线段颜色
          ctx.beginPath()
          ctx.moveTo(pre.coordination[0], pre.coordination[1])
          ctx.lineTo(cur.coordination[0], cur.coordination[1])
          ctx.stroke()
          ctx.closePath()
          return cur
        })
      },
      // 绘制背景图
      drawBgc(canvas) {
        const _this = this
        var img = new Image(30, 30)

        img.src = require('../static/map.jpg')
        img.onload = function() {
          canvas.style.backgroundSize = `${this.canvasWidth}px ${this.canvasHeight}px`
          canvas.style.backgroundImage = 'url(' + img.src + ')'
        }
      },

      movaAlongLine(type) {
        // 开始新路线前，取消上次循环，防止多个循环同时进行
        cancelAnimationFrame(this.recurringFlag)

        const _this = this
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        let imgIndex = 1 // 该index为图片所要移动到的下一个点的index
        let img = new Image(30, 30)

        img.src = require('../static/moto.png')
        img.onload = function() {
          animate()
        }

        let nodes
        switch (type) {
          case 1:
            nodes = [this.nodes[1], this.nodes[3], this.nodes[5], this.nodes[7], this.nodes[9]]
            break
          case 2:
            nodes = [this.nodes[2], this.nodes[4], this.nodes[6], this.nodes[8]]
            break
          case 3:
            nodes = [this.nodes[0], this.nodes[5], this.nodes[6], this.nodes[7], this.nodes[9]]
            break
        }
        this.imgLocal[0] = nodes[0].coordination[0]
        this.imgLocal[1] = nodes[0].coordination[1]

        function animate() {
          //擦除上一帧的内容
          ctx.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight)
          // 描绘点
          _this.drawPoints(ctx, _this.nodes)
          // 描绘线
          _this.drawPaths(ctx, nodes)
          // 描绘图片
          ctx.drawImage(img, _this.imgLocal[0] - 15, _this.imgLocal[1] - 15, 30, 30)

          const img_x = _this.imgLocal[0] // 图片的 x 坐标
          const img_y = _this.imgLocal[1] // 图片的 y 坐标
          const tarPoint_x = nodes[imgIndex].coordination[0] // 下一个转折点的 x 坐标
          const tarPoint_y = nodes[imgIndex].coordination[1] // 下一个转折点的 y 坐标

          // 若当前图片未走到转折点，则向转折点前进
          if (img_x !== tarPoint_x || img_y !== tarPoint_y) {
            // 计算图片与下一个转折点的 x、y 方向距离
            const dis_x = tarPoint_x - img_x
            const dis_y = tarPoint_y - img_y

            if (Math.abs(dis_x) >= Math.abs(dis_y)) {
              if (dis_y !== 0) {
                const fre_y = dis_y / Math.abs(dis_x)
                _this.imgLocal[1] += fre_y
              }

              _this.imgLocal[0] += Math.abs(dis_x) / dis_x
            } else {
              if (dis_x > 0) {
                const fre_x = dis_x / Math.abs(dis_y)
                _this.imgLocal[0] += fre_x
              }

              _this.imgLocal[1] += Math.abs(dis_y) / dis_y
            }

            _this.recurringFlag = requestAnimationFrame(animate)
          } else if (imgIndex < nodes.length - 1) {
            imgIndex++

            requestAnimationFrame(animate)
          } else {
            return
          }
        }
      }
    },
    mounted() {
      var canvas = document.getElementById('canvas') //获得画布
      var ctx = canvas.getContext('2d') //注意：2d小写， 3d：webgl
      canvas.width = this.canvasWidth //设置标签的属性宽高
      canvas.height = this.canvasHeight //千万不要用 canvas.style.height

      this.drawBgc(canvas)
      this.drawPoints(ctx, this.nodes)
    }
  }
</script>
<style scoped>
  .operate-bar {
    padding: 0.2rem;
  }
  .clear-btn {
    margin-left: 0.4rem;
  }
</style>
