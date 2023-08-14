<template>
  <div class="TrueTooTen_wrap">
    <div class="card_wrap">
      <norm title="实时监控预警" :icon="2" />
      <el-button size="small" class="warningBtn" @click="handelrWarning">实时监控列表</el-button>
    </div>
    <div class="echartsBox">
      <Video :videoInfo="videoInfo" id="default"></Video>
    </div>
    <el-dialog title="实时监控列表" :visible.sync="warningType" :append-to-body="true" width="70%">
      <el-row>
        <el-col :span="6">
          <div class="treeBox">
            <el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="id" default-expand-all
              @node-click="handleNodeClick"></el-tree>
          </div>

        </el-col>
        <el-col :span="18">
          <Video v-if="warningType" :videoInfo="bigvideoInfo" id="bigVideo"></Video>
          <div class="keybox">
            <div>
              <img @click="handleKey('UP_LEFT')" src="@/assets/image/zuoshang.png" alt="">
              <img @click="handleKey('TILT_UP')" src="@/assets/image/up.png" alt="">
              <img @click="handleKey('UP_RIGHT')" src="@/assets/image/youshang.png" alt="">
            </div>
            <div>
              <img @click="handleKey('PAN_LEFT')" src="@/assets/image/left.png" alt="">
              <p></p>
              <img @click="handleKey('PAN_RIGHT')" src="@/assets/image/right.png" alt="">
            </div>
            <div>
              <img @click="handleKey('DOWN_LEFT')" src="@/assets/image/zuoxia.png" alt="">
              <img @click="handleKey('TILT_DOWN')" src="@/assets/image/down.png" alt="">
              <img @click="handleKey('DOWN_RIGHT')" src="@/assets/image/youxia.png" alt="">
            </div>
            <el-button @click="handelSnap" type="primary" :disabled="snapLoding ? true : false">{{ snapLoding ? snapLoding
              : '抓拍' }}</el-button>
          </div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="warningType = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import norm from '../norm'
import defaultOptions from './option.js'
import api from '@/api/api'
import Video from "@/components/Video";
import { handleDownload } from "@/utils/download";

export default {
  name: 'TrueTooTen',
  components: { norm, Video, },
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
      videoInfo: {},
      bigvideoInfo: {},
      treeData: [],
      curVideoData: null,
      snapLoding: 0,
      defaultProps: {
        children: 'subTreeNodes',
        label: 'name'
      }
    }
  },
  mounted() {
    this.getvideoList()
    this.getTreeData()
  },
  watch: {

    warningType(n) {
      if (n) {
        document.addEventListener('keydown', this.handleKeyPress)

      } else {
        // this.stopRtmp()
        document.removeEventListener('keydown', this.handleKeyPress)

      }
    }
  },
  methods: {
    handleNodeClick(node) {
      // 在这里处理最后一级子节点被点击的事件
      if (node.subTreeNodes.length) return;

      // 首先判断当前点击节点是否为正在播放监控
      if (!this.curVideoData && this.curVideoData.aideDeviceId == node.exObject.aideDeviceId) return;

      // this.stopRtmp().then(() => {
      //   this.curVideoData = node.exObject
      // 获取摄像头信息 开始推流
      this.getVideoUrl()
      // })





    },
    // 结束推流
    async stopRtmp() {
      return new Promise((resovr, reject) => {
        api.stopRtmp({ id: this.curVideoData.aideDeviceId }).then(res => {
          resovr(res)
        }).catch(e => {
          reject(e)
        })

      })

    },
    // 获取摄像头列表数据
    getTreeData() {
      api.cameraList().then(res => {
        this.treeData = res.data

      })
    },

    getvideoList() {
      api.aideDeviceList().then(res => {
        if (res && res.rows.length) {
          console.log('aideDeviceList', res);
          this.curVideoData = res.rows[0]
          this.getVideoUrl()
        }
      })
    },
    // 获取视频信息 开启推流
    getVideoUrl() {
      let params = {
        id: this.curVideoData.aideDeviceId,
        ipc: this.curVideoData.ip
      }
      console.log(params);
      api.startTranscode(params).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.videoInfo = res.data
        }
      })
    },
    handelrWarning() {
      // this.getTreeData()
      // warningType 为true 弹窗打开
      if (!this.warningType) {
        let params = {
          id: this.curVideoData.aideDeviceId,
          ipc: this.curVideoData.ip
        }
        api.startTranscode(params).then(res => {
          this.bigvideoInfo = res.data
        })

      } else {
        api.startTranscode(params).then(res => {
          this.videoInfo = res.data
        })
      }
      this.warningType = !this.warningType
    },
    handleKey(key) {
      this.handleKeyPress({}, key)
    },
    handelSnap() {
      let data = {
        id: '', ipc: '',
        alarmId: ''
      }
      api.catchPic(data).then(response => {
        handleDownload(response.data[0])
      }).catch(error => {
        console.error(error);
      });


      // this.snapLoding = 10
      // let time = setInterval(() => {
      //   if (this.snapLoding <= 1) {
      //     clearInterval(time)
      //   }
      //   this.snapLoding--
      // }, 1000);
    },
    handleKeyPress(event, key) {
      let data = {
        id: this.curVideoData.aideDeviceId,
        ipc: this.curVideoData.ip,
        mill: 1000,
        command: key
      }
      // 根据按键调用后端API实现摄像头方向转动
      switch (event.key) {
        case 'ArrowUp':
          // 上方向键逻辑
          data.command = 'TILT_UP'
          break;
        case 'ArrowDown':
          // 下方向键逻辑
          data.command = 'TILT_DOWN'
          break;
        case 'ArrowLeft':
          // 左方向键逻辑
          data.command = 'PAN_LEFT'
          break;
        case 'ArrowRight':
          // 右方向键逻辑
          data.command = 'PAN_RIGHT'
          break;
        default:
          break;
      }
      api.actionControl(data).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.error(error);
      });
    },
  },
  computed: {

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
      top: 0.1rem;
    }
  }

  .echartsBox {
    height: 2rem;
    width: 100%;
    // background: url('../../assets/top10.png') no-repeat;
    // background-size: 2rem 100%;
    // margin-left: 10%;
  }



}

.treeBox {
  max-height: 45vh;
  overflow: hidden;
  overflow-y: auto;
}

.keybox {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    width: 50px;
    margin: 5px;
  }

  img {
    width: 50px;
    height: auto;
    background: #ccc;
    margin: 5px;
    cursor: pointer;

    &:hover {
      background: #4e4d4d;
    }
  }

  div {
    display: flex;
    align-items: center;
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
