<template>
  <div class="TrueTooTen_wrap">
    <div class="card_wrap">
      <norm title="实时监控预警" :icon="2" />
      <el-button size="small" class="warningBtn" @click="handelrWarning">实时监控列表</el-button>
    </div>
    <div class="echartsBox">
      <Wxmap ref="Wxmap" class="Wxmap" :mapCenter="wxMapCenter"></Wxmap>
      <!-- <Video :videoInfo="videoInfo" id="default"></Video> -->
    </div>
  </div>
</template>
<script>
import norm from "../norm";
import defaultOptions from "./option.js";
import api from "@/api/api";
import Wxmap from "../../../Wxmap";
import { handleDownload } from "@/utils/download";

export default {
  name: "TrueTooTen",
  components: { norm, Wxmap },
  props: {
   
  },
  data() {
    return {
      defaultOptions,
      warningType: false,
      videoUrl: "",
      videoInfo: {},
      bigvideoInfo: {},
      treeData: [],
      curVideoData: null,
      snapLoding: 0,
      defaultProps: {
        children: "subTreeNodes",
        label: "name",
      },
      wxMapCenter: '117.6467359060|38.7525269150',

    };
  },
  mounted() {
    this.getvideoList();
    this.getTreeData();
  },
  watch: {
    warningType(n) {
      if (n) {
        document.addEventListener("keydown", this.handleKeyPress);
      } else {
        this.stopRtmp()
        document.removeEventListener("keydown", this.handleKeyPress);
      }
    },
  },
  methods: {
    handleNodeClick(node) {
      // 在这里处理最后一级子节点被点击的事件
      if (node.subTreeNodes.length) return;

      // 首先判断当前点击节点是否为正在播放监控
      if (
        !this.curVideoData &&
        this.curVideoData.aideDeviceId == node.exObject.aideDeviceId
      )
        return;

      this.stopRtmp()

      setTimeout(() => {
        this.curVideoData = node.exObject;
        // 获取摄像头信息 开始推流
        let params = {
          id: this.curVideoData.aideDeviceId,
          ipc: this.curVideoData.ip,
        };
        api.startTranscode(params).then((res) => {
          this.bigvideoInfo = res.data;
        });
      }, 1000)

    },
    // 结束推流
    async stopRtmp() {
      return new Promise((resovr, reject) => {
        api
          .stopRtmp({
            id: this.curVideoData.aideDeviceId,
            tasker: this.bigvideoInfo.tasker,
          })
          .then((res) => {
            resovr(res);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    // 获取摄像头列表数据
    getTreeData() {
      api.cameraList().then((res) => {
        this.treeData = res.data;
      });
    },

    getvideoList() {
      api.aideDeviceList().then((res) => {
        if (res && res.rows.length) {
          console.log("aideDeviceList", res);
          this.curVideoData = res.rows[0];
          this.getVideoUrl();
        }
      });
    },
    // 获取视频信息 开启推流
    getVideoUrl() {
      let params = {
        id: this.curVideoData.aideDeviceId,
        ipc: this.curVideoData.ip,
      };
      api.startTranscode(params).then((res) => {
        console.log('startTranscode', res);
        if (res.code == 200) {
          this.videoInfo = res.data;
        }
      });
    },
    handelrWarning() {
      // this.getTreeData()
      // warningType 为true 弹窗打开
      if (!this.warningType) {
        let params = {
          id: this.curVideoData.aideDeviceId,
          ipc: this.curVideoData.ip,
        };
        api.startTranscode(params).then((res) => {
          this.bigvideoInfo = res.data;
        });
      } else {
        // api.startTranscode(params).then((res) => {
        //   this.videoInfo = res.data;
        // });
      }
      this.warningType = !this.warningType;
    },
    handleKey(key) {
      this.handleKeyPress({}, key);
    },
    handelSnap() {
      let data = {
        id: this.curVideoData.id,
        ipc: this.curVideoData.ipc,
        alarmId: this.curVideoData.alarmId,
      };
      api
        .catchPic(data)
        .then((response) => {
          handleDownload(response.data[0]);
        })
        .catch((error) => {
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
        command: key,
      };
      // 根据按键调用后端API实现摄像头方向转动
      switch (event.key) {
        case "ArrowUp":
          // 上方向键逻辑
          data.command = "TILT_UP";
          break;
        case "ArrowDown":
          // 下方向键逻辑
          data.command = "TILT_DOWN";
          break;
        case "ArrowLeft":
          // 左方向键逻辑
          data.command = "PAN_LEFT";
          break;
        case "ArrowRight":
          // 右方向键逻辑
          data.command = "PAN_RIGHT";
          break;
        default:
          break;
      }
      api
        .actionControl(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  computed: {},
};
</script>
<style lang="less" scoped>
.TrueTooTen_wrap {
  height: 25%;

  .card_wrap {
    margin-bottom: 0.1rem;
    position: relative;

    .warningBtn {
      position: absolute;
      right: 15%;
      top: 0.15rem;
      border: none;
      color: #fff;
      background: transparent;
      cursor: pointer;
    }
  }

  .echartsBox {
    height: 2rem;
    width: 100%;
    // background: url('../../assets/top10.png') no-repeat;
    // background-size: 2rem 100%;
    // margin-left: 10%;
    .Wxmap{
      height: 100%;
    }
  }
}

.treeBox {
  max-height: 45vh;
  overflow: hidden;
  overflow-y: auto;
  .el-tree{
    background: transparent;
    color: #fff;
  }
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
    background: #409eff !important;
  }
}
</style>
