<template>
  <section>
    <canvas id="canvas" ref="canvas" />
  </section>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      ctx: null,
      events: null,
    };
  },
  mounted() {
    this.getCanvas();
    this.setCanvas();

    // 监听事件
    document.addEventListener(this.events[0], this.startEventHandler);
  },
  methods: {
    getCanvas() {
      // 获取画布上下文
      const canvas = document.getElementById("canvas");
      console.log(canvas);

      if (canvas) {
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
      }
      // 初始化事件
      const events =
        "ontouchstart" in window
          ? ["touchstart", "touchmove", "touchend"]
          : ["mousedown", "mousemove", "mouseup"];

      this.events = events;
    },
    setCanvas() {
      const { ctx } = this;
      // 设置当前线条的宽度
      ctx.lineWidth = 2;
      // 模糊边缘出现的锯齿
      ctx.shadowBlur = 1;
      // 末端添加圆形线帽
      ctx.lineCap = "round";
      // 条线交汇时为圆形边角
      ctx.lineJoin = "round";
      // 阴影颜色
      ctx.shadowColor = "#000";
      // 设置线条的颜色
      ctx.strokeStyle = "#000";
    },
    drawPoints(e) {
      const { ctx } = this;
      const canvas = document.getElementById("canvas");
      const coverPos = canvas.getBoundingClientRect();
      const pointX = e.pageX - coverPos.left;
      const pointY = e.pageY - coverPos.top;

      ctx.fillStyle = "#000"; // 点的颜色
      ctx.beginPath();
      ctx.arc(pointX, pointY, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    },
    startEventHandler(e) {
      const { events } = this;
      document.addEventListener(events[1], this.moveEventHandler, false);
      document.addEventListener(events[2], this.endEventHandler, false);

      this.drawPoints(e);
    },
    endEventHandler() {
      event.preventDefault();
      const { events, moveEventHandler, endEventHandler } = this;
      document.removeEventListener(events[1], moveEventHandler, false);
      document.removeEventListener(events[2], endEventHandler, false);
    },
    moveEventHandler(event) {
      event.preventDefault();
      const { ctx } = this;
      // todo：此处判断是否为触屏设备
      const isSupportTouch = false;
      const canvas = document.getElementById("canvas");
      const evt = isSupportTouch ? event.touches[0] : event;
      const coverPos = canvas.getBoundingClientRect();
      const mouseX = evt.clientX - coverPos.left;
      const mouseY = evt.clientY - coverPos.top;

      ctx.beginPath();
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    },
  },
};
</script>
<style scoped>
#canvas {
  border: 1px solid black;
}
</style>
