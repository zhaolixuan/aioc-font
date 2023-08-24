/*
 * @Author: tjc
 * @Date: 2019-11-22 18:44:42
 * @LastEditTime : 2020-02-04 10:21:53
 * @LastEditors  : tangjuncheng
 * @Description: 地图场景旋转
 * @FilePath: \aioc-front\src\views\IndustryStandard\mine_gl_map\utils\rotate.js
 */
class Rotate {
  /**
   * 初始化
   * @param map
   * @param options
   */
  constructor(map, options) {
    this.map = map
    this.options = options
    // 旋转动画计时器
    this.rotateAnimation = null
    // 鼠标动作计时器
    this.monitor = null
    this.moving = false
    this.init(options)
  }

  init(options) {
    this.defaultBearing = this.map.getBearing()
    this.currentBearing = this.defaultBearing
    let speed = options.speed // 旋转速度
    let time = options.time // 旋转时长
    let mouseControl = options.mouseControl // 是否响应鼠标事件
    let startTime = performance.now() // 当前开始时间
    let noOperationTime = 99999 // 没有任何操作的时常

    // 旋转

    const move = (now) => {
      this.currentBearing += speed
      if (this.currentBearing >= 360) {
        this.currentBearing = 0
      }
      this.map.setBearing(this.currentBearing) // 水平方向的偏转角度

      this.moving = true
      if (time > 0 && now - startTime > time) {
        cancelAnimationFrame(this.rotateAnimation) // 停止动画
      } else {
        this.rotateAnimation = requestAnimationFrame(move)
      }
    }

    // 监听鼠标移动事件
    if (mouseControl) {
      let lastTime = performance.now()
      let flag = false
      const mouseMonitor = (realTime) => {
        noOperationTime += realTime - lastTime // 累加鼠标未移动的时长
        lastTime = realTime

        // 未操作时长超过8秒则开始旋转
        if (flag && noOperationTime > 10000) {
          this.startAnimation()
          flag = false
        }
        this.monitor = requestAnimationFrame(mouseMonitor)
      }

      this.map.on('mousemove', () => {
        // 重置时间轴
        noOperationTime = 0
        flag = true
        cancelAnimationFrame(this.rotateAnimation)
      })
      this.map.on('zoomstart', () => {
        // 重置时间轴
        noOperationTime = 0
        flag = true
        cancelAnimationFrame(this.rotateAnimation)
      })
      // this.map.on('rotatestart', () => {
      //   // 重置时间轴
      //   // noOperationTime = 0
      //   // flag = true
      //   // cancelAnimationFrame(this.rotateAnimation)
      // })
      mouseMonitor(startTime)
    }
    move(startTime)
  }

  /**
   * 开始动画
   */
  startAnimation() {
    this.stopAnimation()
    this.init(this.options)
  }

  /**
   * 停止动画
   */
  stopAnimation() {
    // noOperationTime = 0
    // flag = true
    cancelAnimationFrame(this.rotateAnimation)
    cancelAnimationFrame(this.monitor)
    // this.map.setBearing(this.defaultBearing);
  }

  /**
   *@重启动画
   *@author lc
   *@date 2018-04-18 13:40:29
   */
  restartAnimation() {
    if (this.map.loaded()) {
      this.startAnimation()
    } else {
      setTimeout(() => {
        this.restartAnimation()
      }, 200)
    }
  }

  /**
   *
   * @returns {boolean}
   */
  isMoving() {
    return this.moving
  }

  destory() {
    this.stopAnimation()
    this.moving = false
  }
}

export default Rotate
