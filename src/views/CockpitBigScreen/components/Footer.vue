<template>
  <div class="footer_wrap">

    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" class="demo-form-inline" >
      <el-form-item label="主机名称" prop="hostId">
        <el-select v-model="queryParams.hostId" placeholder="请选择主机名称" @change="selectChannel" >
          <el-option
            v-for="(host,index) in pipeLineList"
            :key="host.id"
            :label="host.name"
            :value="host.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="通道名称" prop="channelId">
        <el-select v-model="queryParams.channelId" placeholder="请选择通道名称" @change="selectZone" >
          <el-option
            v-for="(channel,index) in channelList"
            :key="channel.id"
            :label="channel.name"
            :value="channel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分区名称" prop="channelZoneId">
        <el-select v-model="queryParams.channelZoneId" placeholder="请选择分区名称" @change="setChannelId">
          <el-option
            v-for="(zone,index) in zones"
            :key="zone.id"
            :label="zone.name"
            :value="zone.id"
          />
        </el-select>
      </el-form-item>
     <el-form-item label="警告类型" prop="alarmType">
        <el-select v-model="queryParams.alarmType" placeholder="请选择警告类型" @change="setOptionALarmCategory($event,false)" >
          <el-option
            v-for="(item,index) in optionSelectAlarmType"
            :key="item.alarmValue"
            :label="item.alarmLabel"
            :value="item.alarmValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警分类" prop="alarmCategory">
          <el-select v-model="queryParams.alarmCategory" placeholder="请输入告警分类"  clearable  :disabled="isAble">
          <el-option
            v-for="(item,index) in optionAlarmCategory"
            :key="item.alarmValue"
            :label="item.alarmLabel"
            :value="item.alarmValue"
          />
        </el-select>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-table :data="alarmList">
      <!-- <el-table-column label="主机id" align="center" prop="hostId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_data_status" :value="scope.row.hostId"/>
        </template>
      </el-table-column> -->
      <el-table-column label="主机名称" align="center" prop="hostName"  />
      <!-- <el-table-column label="通道id" align="center" prop="channelId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_data_status" :value="scope.row.channelId"/>
        </template>
      </el-table-column> -->
      <el-table-column label="通道名称" align="center" prop="channelName" />
      <!-- <el-table-column label="通道分区id" align="center" prop="channelZoneId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_data_status" :value="scope.row.channelZoneId"/>
        </template>
      </el-table-column> -->
      <el-table-column label="分区名称" align="center" prop="fenquName" />
      <!-- <el-table-column label="警告编号" align="center" prop="alarmId" /> -->
      <!-- <el-table-column label="警告地区" align="center" prop="region" /> -->
      <el-table-column label="警告类型" align="center" prop="alarmType" width="100">
        <template slot-scope="scope">
          <el-tag type="info">{{ getAlarmLabel(scope.row.alarmType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="告警分类" align="center" prop="alarmCategory" width="100">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.alarmCategory">{{ getAlarmCategoryLabel(scope.row.alarmCategory) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="起始位置" align="center" prop="startPosition" width="100" />
      <el-table-column label="结束位置" align="center" prop="endPosition" width="100"/>
      <!-- <el-table-column label="所在经纬度" align="center" prop="latitude" />
      <el-table-column label="传感数值" align="center" prop="sensorValue" />
      <el-table-column label="报警编码" align="center" prop="alarmCode" /> -->
      <!-- <el-table-column label="报警数值" align="center" prop="alarmValue" /> -->
      <el-table-column label="警告时间" align="center" prop="warningTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warningTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status == '1' ? '已处理' : '未处理' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status != 1" icon="el-icon-edit"
            @click="handleAlarm(scope.row)">处理</el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { setRedisData, getRedisData, lpopRedisData } from "@/utils/redis";

import api from "@/api/api";
export default {
  props: ['alarmList'],
  data() {
    return {
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
      time: null,
    };
  },
  watch: {

  },
  mounted() {
   
    this.getOptionData();
  },
  destroyed() {
  },
  methods: {
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
      this.loadPipleLineInfo()
      this.setOptionAlarms()
    },

    selectChannel(data) {
      for (let a = 0; a < this.pipeLineList.length; a++) {
        if (data == this.pipeLineList[a].id) {
          this.channelList = this.pipeLineList[a].subTreeNodes;
        }
      };
    },
    selectZone(data) {
      for (let a = 0; a < this.channelList.length; a++) {
        if (data == this.channelList[a].id) {
          this.zones = this.channelList[a].subTreeNodes;
        }
      };
    },
    setChannelId(data) {
      this.$set(this.queryParams, this.queryParams.channelZoneId, data);
    },

    loadPipleLineInfo() {
      //给下拉框赋值，主机、通道、分区等信息
      api.listPipleLine().then(response => {
        this.pipeLineList = response.data;
      });
    },
    setOptionAlarms() {
      api.optionsAlarmType().then(response => {
        this.optionSelectAlarmType = response.data;
      });
      api.optionsAlarmCategory().then(response => {
        this.optionAlarmCategory2 = response.data;
        console.log(this.optionAlarmCategory2);
        // alert("****"+ this.optionAlarmCategory2);
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
      };
    },
    //根据告警分类获取告警标签
    getAlarmCategoryLabel(data) {
      // if(data == null){
      //   return ""
      // }
      // alert(data);
      // alert(optionAlarmCategory2);
      for (let a = 0; a < this.optionAlarmCategory2.length; a++) {
        if (data == this.optionAlarmCategory2[a].alarmValue) {

          return this.optionAlarmCategory2[a].alarmLabel;
          // this.zones = this.channelList[a].subTreeNodes;
        }
      };
    },
    setOptionALarmCategory(data, flag) {
      //如果警告类型为告警则初始化告警分类下拉框
      if (data == 3) {
        optionsAlarmCategory().then(response => {
          if (flag) {
            this.optionAlarmCategory1 = response.data;
          } else {
            this.isAble = false;
            this.optionAlarmCategory = response.data;
          };
        });
      } else {
        if (!flag) {
          this.queryParams.alarmCategory = "";
          this.isAble = true;
        }
      };

    },

    handleAlarm(data) {
      this.$emit('handleAlarm', data)
    },
  },
};
</script>
<style lang='less' scoped>
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

  /deep/ .el-form {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;

    .el-form-item {
      display: flex;
      align-content: center;
      margin-right: 0.4rem;

      .el-form-item__label {
        color: #fff;
      }

      .el-input__inner {
        background-color: transparent;
        color: #fff;
      }

      .el-input-number__decrease,
      .el-input-number__increase {
        background: transparent;
        color: #fff;
      }
    }
  }

  /deep/ .el-table {
    padding: 0 0.1rem;

    .el-table__body-wrapper {
      height: 1.8rem;
      overflow: hidden;
      overflow-y: auto;
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

.el-button {
  background: transparent !important;
  color: #fff !important;
  padding: 10px 12px;
}
</style>