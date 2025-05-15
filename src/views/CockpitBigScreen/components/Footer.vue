<template>
  <div class="footer_wrap">
    <el-table :data="alarmList">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="主机名称" align="center" prop="hostName" />

      <el-table-column label="通道名称" align="center" prop="channelName" />

      <el-table-column label="分区名称" align="center" prop="fenquName" />
      <el-table-column label="警告类型" align="center" prop="alarmType">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.alarmType">{{
            getAlarmLabel(scope.row.alarmType)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警级别" align="center" prop="alarmLevel">
        <template slot-scope="scope">
          {{ scope.row.alarmLevel }}
          <el-tag type="info" v-if="scope.row.alarmLevel">{{
            getAlarmCategoryLabel(scope.row.alarmLevel)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地理位置" align="center" prop="alarmValue" />
      <el-table-column label="光缆位置" align="center" prop="startPosition" />
      <!-- <el-table-column
        label="结束位置"
        align="center"
        prop="endPosition"
      /> -->

      <el-table-column
        label="警告时间"
        align="center"
        prop="warningTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.warningTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="status">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status == "1" ? "已处理" : "未处理" }}</span> -->
          <span v-if="scope.row.status == '0'">未处理</span>
          <span v-if="scope.row.status == '1'">已处理</span>
          <span v-if="scope.row.status == '2'">已受理</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status != 1"
            icon="el-icon-edit"
            @click="handleAlarm(scope.row)"
            >处理</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handlerboxin(scope.row)"
            >查看波形图</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- eventHandle -->
    <el-dialog
      title="处 理"
      :visible.sync="eventVisible"
      :modal-append-to-body="false"
      width="50%"
    >
      <div style="padding: 0 6%">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="dialogForm">
              <div class="dialogForm_title">主机名称：</div>
              <div class="dialogForm_value">{{ dialogForm.hostName }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="dialogForm">
              <div class="dialogForm_title">通道名称：</div>
              <div class="dialogForm_value">{{ dialogForm.channelName }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="dialogForm">
              <div class="dialogForm_title">分区名称：</div>
              <div class="dialogForm_value">{{ dialogForm.fenquName }}</div>
            </div>
          </el-col>
          <!-- <el-col :span="12">
            <div class="dialogForm">
              <div class="dialogForm_title">警告类型：</div>
              <div class="dialogForm_value">
                <el-tag type="info" v-if="dialogForm.alarmType">
                  {{ getAlarmLabel(dialogForm.alarmType) }}
                </el-tag>
              </div>
            </div>
          </el-col> -->
        </el-row>

        <el-form
          :model="dialogParams"
          ref="queryForm"
          size="small"
          label-width="90px"
          label-position="left"
        >
          <!-- :inline="true" -->
          <el-form-item label="警告类型：" prop="alarmType">
            <el-select
              v-model="dialogParams.alarmType"
              placeholder="请选择警告类型"
              @change="alarmTypeChange"
              >
              <el-option
                v-for="host in optionSelectAlarmType"
                :key="host.alarmValue"
                :label="host.alarmLabel"
                :value="host.alarmValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警内容：" prop="alarmContent">
            <el-input
              type="textarea"
              v-model="dialogParams.alarmContent"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理措施：" prop="solveMeasures">
            <el-input
              type="textarea"
              v-model="dialogParams.solveMeasures"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理状态：" prop="status">
            <el-select
              v-model="dialogParams.status"
              placeholder="请选择处理状态"
              @change="alarmTypeChange"
              >
              <el-option
                v-for="host in sysTypeLits"
                :key="host.dictValue"
                :label="host.dictLabel"
                :value="host.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogParams.status == 2" label="反馈结果：" prop="feedback">
            <el-input
              type="textarea"
              v-model="dialogParams.feedback"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="解决时间：" prop="solveTime">
            <el-date-picker
              v-model="dialogParams.solveTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeRealTimeDialog">处理</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { setRedisData, getRedisData, lpopRedisData } from "@/utils/redis";
import moment from "moment";
import api from "@/api/api";
import { Message } from "element-ui";
export default {
  props: ["alarmList"],
  data() {
    return {
      alarmTypeList: [],
      sysTypeLits: [],
      eventVisible: false,
      dialogForm: {},
      dialogParams: {
        alarmContent: "",
        solveMeasures: "",
        solveTime: "",
        feedback: "",
        alarmType:"",
        status:"",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        region: null,
        hostId: null,
        hostName: null,
        channelId: null,
        channelName: null,
        channelZoneId: null,
        channelZoneName: null,
        alarmType: null,
        alarmCategory: null,
        alarmPosition: null,
        latitude: null,
        sensorValue: null,
        alarmCode: null,
        alarmValue: null,
        warningTime: null,
        status: null,
        createTime: null,
        updateTime: null,
      },
      optionAlarmCategory2: [],
      optionSelectAlarmType: [],
      // alarmList: [],
      pipeLineList: [],
      channelList: [],
      zones: [],
      isAble: true,
      optionAlarmCategory: [],
      optionAlarmLevel: [],
      time: null,
    };
  },
  watch: {},
  created() {
    this.sysDataProce();
  },
  mounted() {
    this.getOptionData();
  },
  destroyed() {},
  methods: {
    sysDataProce() {
      api.sysDataProce().then((response) => {
        if (response.data && response.data.length > 0) {
          this.sysTypeLits = response.data;
        }
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.queryParams.hostId = null;
      this.queryParams.channelId = null;
      this.queryParams.channelZoneId = null;
      // this.resetForm("queryForm");
      // this.handleQuery();
      // this.getOptionData();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.getOptionData();
      // this.getList();
    },
    getOptionData() {
      this.loadPipleLineInfo();
      this.setOptionAlarms();
    },

    selectChannel(data) {
      for (let a = 0; a < this.pipeLineList.length; a++) {
        if (data == this.pipeLineList[a].id) {
          this.channelList = this.pipeLineList[a].subTreeNodes;
        }
      }
    },
    selectZone(data) {
      for (let a = 0; a < this.channelList.length; a++) {
        if (data == this.channelList[a].id) {
          this.zones = this.channelList[a].subTreeNodes;
        }
      }
    },
    setChannelId(data) {
      this.$set(this.queryParams, this.queryParams.channelZoneId, data);
    },

    loadPipleLineInfo() {
      //给下拉框赋值，主机、通道、分区等信息
      api.listPipleLine().then((response) => {
        this.pipeLineList = response.data;
      });
    },
    setOptionAlarms() {
      api.optionsAlarmType().then((response) => {
        this.optionSelectAlarmType = response.data;
      });
      api.optionsAlarmCategory().then((response) => {
        this.optionAlarmCategory2 = response.data;
      });
      api.optionsAlarmLevel().then((response) => {
        this.optionAlarmLevel = response.data;
      });
    },
    //根据类型值获取警告类型名称
    getAlarmLabel(data) {
      // alert(data);
      for (let a = 0; a < this.optionSelectAlarmType.length; a++) {
        if (data == this.optionSelectAlarmType[a].alarmValue) {
          return this.optionSelectAlarmType[a].alarmLabel;
          // this.zones = this.channelList[a].subTreeNodes;
        }
      }
    },

    getAlarmCategoryLabel(data) {
      for (let a = 0; a < this.optionAlarmLevel.length; a++) {
        if (data == this.optionAlarmLevel[a].dictValue) {
          return this.optionAlarmLevel[a].dictLabel;
        }
      }
    },
    setOptionALarmCategory(data, flag) {
      //如果警告类型为告警则初始化告警分类下拉框
      if (data == 3) {
        optionsAlarmCategory().then((response) => {
          if (flag) {
            this.optionAlarmCategory1 = response.data;
          } else {
            this.isAble = false;
            this.optionAlarmCategory = response.data;
          }
        });
      } else {
        if (!flag) {
          this.queryParams.alarmCategory = "";
          this.isAble = true;
        }
      }
    },

    handlerboxin(data) {
      this.$emit("handlerboxin", data);
    },

    handleAlarm(data) {
      this.dialogForm = data;
      // this.dialogParams.solveTime = moment().format("YYYY-MM-DD HH:mm:ss");
      this.dialogParams.alarmType=data.alarmType;
      this.dialogParams.alarmContent=data.alarmContent;
      this.dialogParams.solveMeasures=data.solveMeasures;
      this.dialogParams.solveTime=data.solveTime;
      this.dialogParams.feedback=data.feedback;
      this.dialogParams.status=data.status;

      this.eventVisible = true;
    },
    closeRealTimeDialog() {
      this.dialogParams.alarmId = this.dialogForm.alarmId;
      if( this.dialogParams.status != '2'){
         this.dialogParams.feedback = ''
      }
   api.updateAlarmSolve(this.dialogParams).then((response) => {
        if (response.code == 200) {

          Message.success(response.msg);
          this.$emit("handleAlarm");
        } else {
          Message.error("处理失败");
        }
        this.eventVisible = false;
      });
    },
    alarmTypeChange(value) {
      this.dialogParams.alarmType = value;
      this.$set(this.dialogParams,'alarmType',value)
    },
  },
};
</script>
<style lang="less" scoped>
.footer_wrap {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: relative;

  // pointer-events: none;
  .title {
    width: 100%;
    position: absolute;
    bottom: 0.08rem;
    left: 0;
    text-align: center;
    font-size: 0.15rem;
    line-height: 0.22rem;
    color: #afdeff;

    p {
      margin-left: 0.3rem;
    }
  }

  /deep/ .el-form-item {
    position: relative;
    .el-form-item__label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  // /deep/ .el-form {
  //   display: flex;
  //   align-items: center;
  //   padding: 0 0.4rem;

  //   .el-form-item {
  //     display: flex;
  //     align-content: center;
  //     margin-right: 0.4rem;

  //     .el-form-item__label {
  //       color: #000;
  //     }

  //     .el-input__inner {
  //       background-color: transparent;
  //       color: #000;
  //     }

  //     .el-input-number__decrease,
  //     .el-input-number__increase {
  //       background: transparent;
  //       color: #000;
  //     }
  //   }
  // }

  /deep/ .el-table {
    padding: 0 0.1rem;

    .el-table__body-wrapper {
      height: 1.8rem;
      overflow: auto;
      // overflow-y: auto;
    }
  }
}
</style>
<style lang="less" scoped>
.el-select-dropdown {
  background-color: rgba(0, 81, 127, 0.22) !important;

  .el-select-dropdown__item {
    // color: #fff;
  }

  .el-select-dropdown__item.selected {
    // color: #409EFF;
  }
}
// .dialog-footer{
//   .el-button {
//   background: #fff !important;
//   color: #074b9e !important;
//   padding: 10px 12px;
// }
// }

// .el-form-item__content{
//   margin-left: 0 !important;
// }

// /deep/ .el-dialog__body .el-form {
//   display: flex !important;
//   flex-direction: column;
//   .el-form-item__content {
//     margin-left: 0 !important;
//   }
// }
/deep/ .el-dialog__body{
  padding:12px 20px;
}
.dialogForm {
  display: flex;
  line-height: 50px;
  // margin-left: 20px;
  .dialogForm_title {
    width: 90px;
    font-size: 14px;
    color: #606266;
    font-weight: bold;
  }
  .dialogForm_value {
    margin-left: 10px;
    font-size: 14px;
    color: #606266;
  }
}
/deep/ .el-table__body {
  .cell {
    font-size: 0.18rem;
    line-height: 0.4rem;
  }
}

/deep/ .el-date-editor--datetime {
  height: 50px;
  .el-input__inner {
    height: 50px;
  }
}

/deep/ .el-dialog__header {
  // display: flex;
  // justify-content: center;
  padding: 15px 20px;
  .el-dialog__title {
    margin-left: 5px;
  }
}

/deep/ .el-select {
  width: 100%;
  .el-input__inner {
    width: 100%;
    height: 50px;
  }
}
</style>
