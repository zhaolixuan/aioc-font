<template>
  <div>
    <div class="business">
      <div class="businessTable">
        <el-table :data="zoneList" height="250">
          <!-- <el-table-column label="分区" align="center" prop="channelZoneName" /> -->
          <el-table-column label="分区" align="center" prop="channelZoneName">
            <template slot-scope="scope">
              <div @click="checkChannel(scope.row)" :class="{ 'check': scope.row.channelZoneId == channelZoneId }">
                {{ scope.row.channelZoneName }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scroll">
        <div ref="businessChart" class="businessChart" style="height: 200px; width: 200px"></div>
      </div>
      <div class="scroll">
        8888888888855222222222
      <div ref="businessChart" style="height: 2rem; width: 100%"></div>
    </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/api";
import initChart from "./mixins/initChart.js";
import defaultOptions from "./option.js";
export default {
  mixins: [initChart],
  created() {
    this.getData();
  },
  data() {
    return {
      zoneList: [],
      channelZoneId: "",
      defaultOptions,
    };
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        // this.chart.setOption(this.computedOptions)
        this.chart.setOption({
          xAxis: {
            data: this.infor.name,
          },
          series: this.infor.value2,
        });
      },
    },
  },
  computed: {
    computedOptions() {
      let option = this.defaultOptions;
      option.series = this.infor.value2;
      option.xAxis.data = this.infor.name;
      if (option.xAxis.data.length == 1) {
        option.xAxis.data.push("");
      }
      return option;
    },
  },
  methods: {
    getData() {
      // 分区
      api.zoneList().then((res) => {
        this.zoneList = res.rows;
        this.channelZoneId = res.rows[0]?res.rows[0].channelZoneId:''
        console.log("this.zoneList", this.zoneList);
      });
    },
    checkChannel(row) {
      console.log("选中分区", row);
      this.channelZoneId = row.channelZoneId;
    },
  },
};
</script>
<style lang="less" scoped>
.business {
  display: flex;
  .businessTable {
    // height: 300px;
    width: 200px;
    .check{
        color: red;
    }
  }
}

/deep/ .el-table__cell{
  .cell{
    font-size: 14px;
    line-height: 28px;
  }
}
.businessChart{
  background-color: aqua;
}
</style>
