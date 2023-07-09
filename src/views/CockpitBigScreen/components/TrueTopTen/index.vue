<template>
  <div class="TrueTooTen_wrap">
    <div class="card_wrap">
      <norm title="实时监控预警" :icon="2" />
      <el-button class="warningBtn" @click="handelrWarning">{{ warningType ? '关闭全部报警联动' : '开启全部报警联动'
      }}</el-button>
    </div>
    <div class="echartsBox">
      <!-- <div ref="canvasChart" style="height:2rem;width:100%"></div> -->
    </div>
    <el-dialog title="实时监控预警" :visible.sync="warningType" width="50%">
      <Video></Video>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="warningType = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
import api from '@/api/api'
import Video from "@/components/Video";
export default {
  mixins: [initChart],
  name: 'TrueTooTen',
  components: { norm,Video },
  props: {
    infor: {
      type: Object
    }
  },
  data() {
    return {
      defaultOptions,
      warningType: false,
      videoUrl: '',
    }
  },
  mounted() {
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        // this.chart.setOption(this.computedOptions)
      }
    },
    warningType(n) {
      if (n) {
        document.addEventListener('keydown', this.handleKeyPress)

      } else {
        document.removeEventListener('keydown', this.handleKeyPress)

      }
    }

  },
  methods: {
    handelrWarning() {
      // warningType 为true 弹窗打开
      if (!this.warningType) {
        // api.getVideoUrl().then(res => {
        //   console.log(res);
        //   this.videoUrl = response.data.url;

        // })

      }
      this.warningType = !this.warningType

    },
    handleKeyPress(event) {
      console.log(event);
      // 根据按键调用后端API实现摄像头方向转动
      switch (event.key) {
        case 'ArrowUp':
          // 上方向键逻辑
          api.moveUp().then(response => {
            console.log(response.data);
          }).catch(error => {
            console.error(error);
          });
          break;
        case 'ArrowDown':
          // 下方向键逻辑
          api.moveDown().then(response => {
            console.log(response.data);
          }).catch(error => {
            console.error(error);
          });
          break;
        case 'ArrowLeft':
          // 左方向键逻辑
          api.moveLeft().then(response => {
            console.log(response.data);
          }).catch(error => {
            console.error(error);
          });
          break;
        case 'ArrowRight':
          // 右方向键逻辑
          api.moveRight().then(response => {
            console.log(response.data);
          }).catch(error => {
            console.error(error);
          });
          break;
        default:
          break;
      }
    },
  },
  computed: {
    computedOptions() {
      let option = this.defaultOptions
      option.legend[0].data = this.infor.name.slice(0, 5) || []
      option.legend[1].data = this.infor.name.slice(-5) || []
      let newData = []
      this.infor.data.map((item, k) => {
        var obj = {
          value: item.materialNetworkSales,
          name: item.oneLevelName
        }
        newData.push(obj)
      })
      option.series[0].data = newData
      return option
    }
  }
}
</script>
<style lang="less" scoped>
.TrueTooTen_wrap {
  height: 25%;

  .card_wrap {
    margin-bottom: .1rem;
    position: relative;

    .warningBtn {
      position: absolute;
      right: 15%;
      top: 0.18rem;
    }
  }

  .echartsBox {
    height: 2rem;
    width: 100%;
    // background: url('../../assets/top10.png') no-repeat;
    // background-size: 2rem 100%;
    margin-left: 10%;
  }

  

}

/deep/ .el-dialog__header {
  display: flex;
}

.el-dialog__footer {
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .el-button {
    background: #409EFF !important;
  }
}
</style>
