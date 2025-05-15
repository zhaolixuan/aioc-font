<template>
  <div class="BusinessIncome_wrap">
    <div class="businessTable animate">
      <el-table :data="zoneList" height="320">
        <!-- <el-table-column label="分区" align="center" prop="channelZoneName" /> -->
        <el-table-column label="分区" align="left" prop="channelZoneName">
          <template slot-scope="scope">
            <div
              @click="checkChannel(scope.row)"
              :class="{ check: scope.row.channelZoneId == channelZoneId }"
            >
              {{ scope.row.channelZoneName }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="driver"></div>
    <div class="scroll animate">
      <div ref="businessChart" style="height: 320px; width: 100%"></div>
    </div>
  </div>
</template>
<script>
import api from "@/api/api";
import norm from "../norm";
import initChart from "./mixins/initChart.js";
import defaultOptions from "./option.js";
import businessList from "./businessList.vue";
export default {
  mixins: [initChart],
  name: "BusinessIncome",
  components: { norm, businessList },
  props: {
    buttonShow: {
      type: Boolean,
      default: true,
    },
    curHostData: {
      type: Object,
    },
    RealTimeDialogList:{
      type: Boolean,
      default: true,
    }
  },
  computed: {
    businessIncometTitle() {
      return this.$store.state.businessIncometTitle || "";
    },
    computedOptions() {
      let option = this.defaultOptions;
      option.grid = {
        left: "0",
        right: "3%",
        bottom: "10%",
        top: "6%",
        containLabel: true,
      };
      option.series = this.dialogBusinessIncome.value2;
      option.xAxis.data = this.dialogBusinessIncome.name;
      if (option.xAxis.data.length == 1) {
        option.xAxis.data.push("");
      }
      return option;
    },
  },
  data() {
    return {
      defaultOptions,
      businessVisible: true,
      zoneList: [],
      channelZoneId: "",
      channelZoneName: "",
      dialogBusinessIncome: { name: [],
        value: [],
        value2: [
          {
            name: "",
            type: "line",
            data: [],
          },
        ],},
      timer:null,
      channelInfo:[],
    };
  },
  watch: {
    RealTimeDialogList: {
      deep: true,
      handler (oldVal, newVal) {
       if(!oldVal){
        // 如果关闭弹框去清除定时器
        clearInterval(this.timer)
       }else{
        this.getData();
       }
      }
    }
  },
  mounted() {
    //   // console.log('更改代码查看变化');
    this.initChart();
  },

  created() {
    this.getData();
    // this.getboxingData()
  },
  methods: {
    handelrCheck() {
      this.$emit("handelrCheck");
      // this.businessVisible = true;
    },
    getData() {
      // 分区
      api.zoneList().then((res) => {
        this.zoneList = res.rows;
        this.channelInfo=res.rows[0] ? res.rows[0]:[]
        this.channelZoneId = res.rows[0] ? res.rows[0].channelZoneId : "";
        this.channelZoneName = res.rows[0] ? res.rows[0].channelZoneName : "";
        this.getboxingData(this.channelZoneName);
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
          this.getboxingData(this.channelZoneName);
        },2000)
      });
    },
    checkChannel(row) {
      this.channelInfo=row
      this.channelZoneId = row.channelZoneId;
      this.channelZoneName = row.channelZoneName;
      this.getboxingData(this.channelZoneName);
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
          this.getboxingData(this.channelZoneName);
        },2000)
    },
    getboxingData(channelZoneName) {
      this.dialogBusinessIncome = {
        name: [],
        value: [],
        value2: [
          {
            name: "",
            type: "line",
            data: [],
            //   markPoint: {
            //   data: [
            //     { type: 'max', name: 'Max' },
            //     { type: 'min', name: 'Min' }
            //   ]
            // },
            // markLine: {
            //   lineStyle: {
            //     type: "solid",
            //     color: "#ccc",
            //     width: 1.5,
            //   },
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },
        ],
      };

      // api.realTimeData({ step: 1 }).then((res) => {
      //   if (Object.keys(res.data).length) {
      //     if (res.data[this.curHostData.hostNo]) {
      //       let data = JSON.parse(res.data[this.curHostData.hostNo][0]);
      //       data.forEach((item, index) => {
      //         let xdata = [];
      //         for (let index = 0; index < item.sensor.length; index++) {
      //           let num = (index * this.curHostData.factor).toFixed(1);
      //           xdata.push(num);
      //         }
      //         this.dialogBusinessIncome.name = xdata;
      //         this.dialogBusinessIncome.value2[index].name = channelZoneName +'-'+ item.channelName;
      //         this.dialogBusinessIncome.value2[index].data = item.sensor;
      //         this.initChart()
      //       });
      //     }
      //   }
      // });

      // api.guid('1020120241025104612667').then((res) => {
      //   console.log('resresresres',res)
      //   if (res.data) {
      //     let item = res.data;
      //     let xdata = [];
      //     let sevsor = eval(item.sensor);
      //     for (let index = 0; index < sevsor.length; index++) {
      //       let num = (index * this.curHostData.factor).toFixed(1);
      //       xdata.push(num);
      //     }
      //     this.dialogBusinessIncome.name = xdata;
      //     this.dialogBusinessIncome.value2[0].name =item.hostName+' '+channelZoneName +'-'+ item.channelName;
      //     this.dialogBusinessIncome.value2[0].data = sevsor;
      //     console.log('this.dialogBusinessIncome',this.dialogBusinessIncome)
      //     this.initChart()
      //   }
      // });
      // ,channelZoneId: this.channelZoneId
      api.realTimeData({ step: 1}).then((res) => {
        if (Object.keys(res.data).length) {
          if (res.data[this.curHostData.hostNo]) {
            let data = JSON.parse(res.data[this.curHostData.hostNo][0]);
            data.forEach((item, index) => {
              let xdata = [];
              for (let index = this.channelInfo.channelStartNum; index < this.channelInfo.channelEndNum; index++) {
                let num = (index * this.curHostData.factor).toFixed(1);
                xdata.push(num);
              }
              this.dialogBusinessIncome.name = xdata;
              this.dialogBusinessIncome.value2[index].name =channelZoneName ;

              let sensorList = item.sensor.slice( this.channelInfo.channelStartNum-1, this.channelInfo.channelEndNum-1);
              this.dialogBusinessIncome.value2[index].data = sensorList;
              this.initChart();
            });
          }
        } 
      });
    },
  },
};
</script>
<style lang="less" scoped>
.BusinessIncome_wrap {
  height: 25%;
  display: flex;
  // width: 100%;

  .card_wrap {
    margin-bottom: 0.12rem;
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

  .businessTable {
    width: 200px;
    .check {
      color: red;
    }
  }
  .scroll {
    flex: 1;
  }
}

/deep/ .el-table__cell {
  .cell {
    font-size: 14px;
    line-height: 28px;
  }
}

.animate {
  animation: initialAnimation 1s;
  transition: transform 0.5s ease, background-color 0.5s ease;
}

@keyframes initialAnimation {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.driver {
  width: 0;
  height: 320px;
  border-right: dashed gray 2px;
  margin: 0 8px;
}
</style>
