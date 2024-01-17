<template>
  <div class="LeaderCockpit">
    <div class="mask_img"><img src="./assets/mask_bg.png" /></div>
    <Map ref="map" class="map" :mapCenter="mapCenter"></Map>
    <div class="section"></div>
    <div class="header">
      <Header
        :infor="topData"
        @handelrOpenShi="handelrOpenShi"
        @handelrOpenAnfang="handelrOpenAnfang"
      />
    </div>
    <div class="left_wrap">
      <BusinessIncome
        :infor="BusinessIncome"
        @handelrCheck="handelrCheck"
        :buttonShow="true"
      ></BusinessIncome>
      <TrueTopTen></TrueTopTen>
      <NotGoodNetWork :infor="topFiveData"></NotGoodNetWork>
    </div>
    <div class="right_wrap">
      <TotalSaleMoney
        :infor="ljData"
        :flag="flag"
        @changeFlag="changeFlag"
      ></TotalSaleMoney>
      <ShopNumber :infor="sysStatusList"></ShopNumber>
      <GoodsTypeZB></GoodsTypeZB>
    </div>
    <div class="center">
      <CenterDataView
        :infor="centerData"
        :num="centerNumData"
        @handlerHostClick="handlerHostClick"
        :curHostData="curHostData"
      ></CenterDataView>
    </div>
    <div class="footer">
      <Footer
        :alarmList="alarmList"
        @handleAlarm="handleAlarm"
        @handlerboxin="handlerboxin"
      />
    </div>

    <audio
      id="audio"
      controls="controls"
      hidden
      :src="audioUrl"
      ref="audio"
    ></audio>

    <el-dialog title="实时波峰图" :visible.sync="RealTimeDialog" width="50%">
      <BusinessIncome
        :infor="dialogBusinessIncome"
        :buttonShow="false"
      ></BusinessIncome>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="RealTimeDialog = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/api";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import CenterDataView from "./components/CenterDataView";
import BusinessIncome from "./components/BusinessIncome/index";
import TrueTopTen from "./components/TrueTopTen";
import NotGoodNetWork from "./components/NotGoodNetWork";
import TotalSaleMoney from "./components/TotalSaleMoney";
import GoodsTypeZB from "./components/GoodsTypeZB";
import ShopNumber from "./components/ShopNumber";
import RealTimePeakGraph from "./components/RealTimePeakGraph";
import Map from "../Map/index.vue";
import { obtainZone } from "@/utils/pointiInZone";
export default {
  name: "CockpitBigScreen",
  components: {
    Header,
    BusinessIncome,
    Footer,
    CenterDataView,
    Map,
    TrueTopTen,
    NotGoodNetWork,
    TotalSaleMoney,
    GoodsTypeZB,
    ShopNumber,
    RealTimePeakGraph,
  },
  data() {
    return {
      tableList: [],
      industry: "",
      topData: {},
      GoodsTypeZBData: {
        name: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        value: [101, 100, 130, 15, 16, 17, 18, 19, 10, 22, 122],
      },
      BusinessIncome: {
        name: [],
        value: [],
        value2: [{ name: "", type: "line", data: [] }],
      },
      dialogBusinessIncome: {
        name: [],
        value: [],
        value2: [{ name: "", type: "line", data: [] }],
      },
      EnterpriseNumber: {},
      content: "",
      topTenData: {
        name: [],
        value: [],
        data: [],
      },
      topFiveData: {
        name: [],
        value: [],
        data: [],
      },
      ljData: null,
      flag: false,
      RealTimeDialog: false,
      centerData: null,
      centerNumData: 0,
      alarmList: [],
      sysStatusList: [],
      time: null,
      lpopTime: null,
      serveTime: null,
      curHostData: {},
      zoneList: [],
      mapCenter: "",
      anfangbool: true,
      audioUrl: require("./assets/yujing.mp3"),
      BusinessIncometTitle: "",
    };
  },
  mounted() {
    this.getData();
    this.getTimeData();
    this.gettitle();
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      api.getInfo().then((res) => {
        if (res.code == 200) {
          this.$store.commit("setActiveName", res.user.userName);
        }
      });
    },
    gettitle() {
      api.systemconfig().then((res) => {
        this.$store.commit(
          "setBusinessIncometTitle",
          res.data.configValue || ""
        );
      });
    },
    startplay() {
      this.$refs.audio.currentTime = 0; //从头开始播放提示音
      this.$refs.audio.play(); //播放
      setTimeout(() => {
        this.$refs.audio.pause();
      }, 2000);
    },
    // 左上角波纹图放大
    handelrCheck() {
      this.RealTimeDialog = true;
      this.dialogBusinessIncome = this.BusinessIncome;
    },
    handelrOpenShi(bool) {
      if (bool) {
        // 开启
        this.getTimeData();
      } else {
        // 关闭
        this.clearTime();
      }
    },
    handelrOpenAnfang(bool) {
      this.anfangbool = bool;
      if (bool) {
        // 开启安防 取消所有报警
      } else {
        // 关闭安防 开启报警
      }
    },

    clearTime() {
      clearInterval(this.lpopTime);
      clearInterval(this.time);
      clearInterval(this.serveTime);
      this.lpopTime = this.time = this.serveTime = null;
    },
    getTimeData() {
      this.getlpopRedisData();
      this.getList();
      this.getAlarmStatisticsList();
      this.getServe();
    },
    handlerHostClick(data) {
      if (this.curHostData.hostId == data.hostId) return;
      this.curHostData = data;
      this.mapCenter = data.latiscope;
    },
    // foot点击处理时间
    handelgive(data) {
      this.$refs.map.handelgive(data);
    },
    changeFlag(val) {
      this.flag = val;
    },
    getlpopRedisData() {
      if (this.lpopTime) clearInterval(this.lpopTime);
      api.realTimeData({ step: 1 }).then((res) => {
        if (Object.keys(res.data).length) {
          if (res.data[this.curHostData.hostNo]) {
            let data = JSON.parse(res.data[this.curHostData.hostNo][0]);
            data.forEach((item, index) => {
              let xdata = [];
              for (let index = 0; index < item.sensor.length; index++) {
                xdata.push(index);
              }
              this.BusinessIncome.name = xdata;
              this.BusinessIncome.value2[index].name = item.channel;
              this.BusinessIncome.value2[index].data = item.sensor;
            });
          }
        }
        this.lpopTime = setInterval(() => {
          api.realTimeData({ step: 1 }).then((res1) => {
            if (Object.keys(res1.data).length) {
              if (res1.data[this.curHostData.hostNo]) {
                let data = JSON.parse(res1.data[this.curHostData.hostNo][0]);
                data.forEach((item, index) => {
                  let xdata = [];
                  for (let index = 0; index < item.sensor.length; index++) {
                    xdata.push(index);
                  }
                  this.BusinessIncome.name = xdata;
                  this.BusinessIncome.value2[index].name = item.channel;
                  this.BusinessIncome.value2[index].data = item.sensor;
                });
              }
            }
          });
        }, 1000);
      });
    },
    // 报警记录接口
    getList() {
      if (this.time) clearInterval(this.time);
      let params = {
        pageNum: 1,
        pageSize: 1000,
      };
      api.alarmList(params).then((res) => {
        this.$refs.map.addline();
        res.rows.forEach((element) => {
          element.fenquName = obtainZone(element, this.zoneList)
            .map((i) => i.name)
            .join(",");
          if (element.status != 1 && this.anfangbool) {
            this.$refs.map.handelgive(element);
          }
        });

        this.alarmList = res.rows.filter((i) => i.status != 1);

        try {
          if (this.alarmList.length > this.centerNumData && this.anfangbool) {
            this.startplay();
          }
        } catch (error) {
        }

        this.centerNumData = this.alarmList.length;
        this.time = setInterval(() => {
          api.alarmList(params).then((response) => {
            response.rows.forEach((element) => {
              element.fenquName = obtainZone(element, this.zoneList)
                .map((i) => i.name)
                .join(",");
              if (element.status != 1) {
                this.$refs.map.handelgive(element);
              }
            });
            this.alarmList = response.rows.filter((i) => i.status != 1);
            this.centerNumData = this.alarmList.length;
          });
        }, 3000);
      });
    },
    handleAlarm(data) {
      this.$confirm("此告警以处理完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.updateAlarm({ alarmId: data.alarmId, status: 1 }).then((res) => {
            if (res && res.code == 200) {
              
              this.getList();
              this.getAlarmStatisticsList()
              this.$message({
                type: "success",
                message: "处理成功!",
              });
            }
          });
        })
        .catch(() => {});
    },
    handlerboxin(data) {
      this.getboxingData(data);
      this.RealTimeDialog = true;
    },
    getboxingData(data) {
      this.dialogBusinessIncome = {
        name: [],
        value: [],
        value2: [{ name: "", type: "line", data: [] }],
      };
      // let query = {
      //   pageNum: 1,
      //   pageSize: 1,
      //   guid: data.guid
      // }
      api.guid(data.guid).then((res) => {
        if (res.data) {
          let item = res.data;
          let xdata = [];
          let sevsor = eval(item.sensor);
          for (let index = 0; index < sevsor.length; index++) {
            xdata.push(index);
          }
          this.dialogBusinessIncome.name = xdata;
          this.dialogBusinessIncome.value2[0].name = item.channelNo;
          this.dialogBusinessIncome.value2[0].data = sevsor;
        }
      });
    },
    getServe() {
      // 获取服务信息
      if (this.serveTime) clearInterval(this.serveTime);

      api.getServer().then((res) => {
        this.ljData = res.data;
        this.serveTime = setInterval(() => {
          api.getServer().then((res1) => {
            this.ljData = res1.data;
          });
        }, 10000);
      });
    },
    getData() {
      // 分区
      api.zoneList().then((res) => {
        this.zoneList = res.rows;
      });
      //主机
      api.hostManageList().then((res) => {
        this.centerData = res.rows;
        this.curHostData = res.rows[0];
        this.mapCenter = this.curHostData.latiscope;
      });
      // 警告统计接口
     this.getAlarmStatisticsList()
      // 查询系统状态列表
      api.listSysStatus().then((res) => {
        res.rows.forEach((i) => {
          this.sysStatusList.push(i);
        });
      });
    },
    getAlarmStatisticsList(){
      api.alarmStatisticsList().then((res) => {
        this.topFiveData.name = res.rows.map((i) =>
          i.status == 1 ? "已处理" : "未处理"
        );
        this.topFiveData.value = res.rows.map((i) => i.total);
      });
    }
  },
  destroyed() {
    this.clearTime();
  },
};
</script>
<style lang="less" scoped>
.LeaderCockpit {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .mask_img {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9;
    pointer-events: none;

    img {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }

  .header {
    height: 16%;
    width: 100%;
    position: fixed;
    z-index: 11;
  }

  .footer {
    // height: 2.2rem;
    width: 100%;
    position: fixed;
    left: 0rem;
    bottom: 0rem;
    z-index: 101;
    // pointer-events: none;
  }

  .section {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 12;
    background-size: 100% 100%;
    pointer-events: none;
  }

  .left_wrap,
  .right_wrap {
    width: 24%;
    height: 100%;
    position: fixed;
    z-index: 100;
    top: 6.5%;

    .item {
      margin-bottom: 0.15rem;
    }

    .bigTitle_left {
      font-family: "PingFangSC-Semibold";
      width: 2.7rem;
      height: 0.15rem;
      background: url("./assets/left_title.png") no-repeat;
      background-size: 100% 100%;
      font-size: 0.16rem;
      color: #e2feff;
      text-shadow: 0 0 2px #00627a;
      line-height: 0.15rem;
      margin-bottom: 0.28rem;
      text-align: center;
      margin-left: 15%;
      margin-top: 5%;
    }

    .bigTitle_right {
      font-family: "PingFangSC-Semibold";
      width: 3.18rem;
      height: 0.15rem;
      background: url("./assets/right_title.png") no-repeat;
      background-size: 100% 100%;
      font-size: 0.16rem;
      color: #e2feff;
      line-height: 0.15rem;
      text-shadow: 0 0 2px #00627a;
      margin-bottom: 0.28rem;
      text-align: center;
      margin-top: 5%;
      margin-left: 15%;
    }
  }

  .center {
    width: 40%;
    height: 0.9rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    margin-top: 1.4rem;
    box-sizing: border-box;
    z-index: 99;
  }

  .left_wrap {
    left: 1%;
  }

  .right_wrap {
    right: 1%;
  }
}

.map {
  position: absolute;
}

::-webkit-scrollbar {
  width: 0;
}

.left_qyzh {
  position: absolute;
  left: -0.1rem;
  bottom: 0.2rem;
  z-index: 100;
}

.left_qyzh img {
  width: 2.26rem;
  height: 2.53rem;
  display: block;
}

.left_chart {
  position: relative;
  width: 2.26rem;
  height: 2.53rem;
}

.left_chart .chart_bg {
  background: url("./assets/chart.png") no-repeat;
  width: 1.47rem;
  height: 2.35rem;
  background-size: 1.47rem 2.35rem;
  margin-left: 0.4rem;
  position: relative;
}

.left_chart .chart_bg i {
  display: block;
  font-style: normal;
  font-size: 0.12rem;
  position: absolute;
  background: url("./assets/bq_bg.png") no-repeat;
  width: 0.58rem;
  height: 0.24rem;
  background-size: 0.58rem 0.24rem;
  text-align: center;
  line-height: 0.24rem;
  left: 0.3rem;
  top: -0.1rem;
}

.right_chart .chart_bg i {
  display: block;
  font-style: normal;
  font-size: 0.12rem;
  position: absolute;
  background: url("./assets/bq_bg.png") no-repeat;
  width: 0.58rem;
  height: 0.24rem;
  background-size: 0.58rem 0.24rem;
  text-align: center;
  line-height: 0.24rem;
  left: -0.4rem;
  top: -0.05rem;
  transform: scaleX(-1);
  color: #fff;
}

.left_chart .chart_bg .chart_on {
  position: absolute;
  background: url("./assets/chart_on.png") no-repeat bottom;
  width: 1.35rem;
  height: 75%;
  background-size: 1.35rem 2.21rem;
  left: 0.15rem;
  bottom: 0.1rem;
}

.left_chart i {
  color: #fff;
  font-size: 0.12rem;
  position: absolute;
  font-style: normal;
}

.left_chart i.num_1 {
  left: 1.45rem;
  bottom: 0.02rem;
}

.left_chart i.num_2 {
  left: 0.7rem;
  bottom: 0.3rem;
}

.left_chart i.num_3 {
  left: 0.3rem;
  bottom: 1.4rem;
}

.left_chart i.num_4 {
  left: 0;
  bottom: 2.4rem;
}

.left_chart span {
  position: absolute;
  color: #a8e7f6;
  font-size: 0.12rem;
  left: 2rem;
  bottom: 0.2rem;
}

.right_tdmj {
  position: absolute;
  right: -0.1rem;
  bottom: 0.2rem;
  z-index: 100;
}

.right_tdmj img {
  width: 2.75rem;
  height: 2.56rem;
  display: block;
}

.right_chart {
  position: relative;
  width: 2.75rem;
  height: 2.56rem;
}

.right_chart .chart_bg {
  background: url("./assets/chart.png") no-repeat;
  width: 1.47rem;
  height: 2.35rem;
  background-size: 1.47rem 2.35rem;
  position: absolute;
  left: 0.9rem;
  transform: scaleX(-1);
}

.right_chart .chart_bg .chart_on {
  position: absolute;
  background: url("./assets/chart_on.png") no-repeat bottom;
  width: 1.35rem;
  height: 63%;
  background-size: 1.35rem 2.21rem;
  left: 0.15rem;
  bottom: 0.1rem;
  transform: scaleX(1);
}

.right_chart i {
  color: #a8e7f6;
  font-size: 0.12rem;
  position: absolute;
  font-style: normal;
}

.right_chart i.num_1 {
  right: 1.65rem;
  bottom: 0.02rem;
}

.right_chart i.num_2 {
  right: 0.7rem;
  bottom: 0.3rem;
}

.right_chart i.num_3 {
  right: 0.3rem;
  bottom: 1.4rem;
}

.right_chart i.num_4 {
  right: 0;
  bottom: 2.4rem;
}

.right_chart span {
  position: absolute;
  color: #a8e7f6;
  font-size: 0.12rem;
  right: 2rem;
  bottom: 0.12rem;
}

.title_box {
  font-size: 0.14rem;
  color: #fff;
  line-height: 0.22rem;
  margin-bottom: 0.1rem;
  margin-left: 12%;
}

.title_box i {
  background: url("./assets/titicon.png") no-repeat;
  width: 0.22rem;
  height: 0.22rem;
  background-size: 0.22rem 0.22rem;
  float: left;
  margin-right: 0.05rem;
}

.title_box_2 {
  margin-left: 75%;
}

/deep/ .el-dialog__header {
  display: flex;
}

.el-dialog__footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
