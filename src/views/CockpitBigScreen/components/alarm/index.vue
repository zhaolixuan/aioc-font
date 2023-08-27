<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"> -->
      <el-form-item label="主机名称" prop="hostId">
        <el-select v-model="queryParams.hostId" placeholder="请选择主机名称" @change="selectChannel">
          <el-option v-for="(host, index) in pipeLineList" :key="host.id" :label="host.name" :value="host.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="通道名称" prop="channelId">
        <el-select v-model="queryParams.channelId" placeholder="请选择通道名称" @change="selectZone">
          <el-option v-for="(channel, index) in channelList" :key="channel.id" :label="channel.name"
            :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="分区名称" prop="channelZoneId">
        <el-select v-model="queryParams.channelZoneId" placeholder="请选择分区名称" @change="setChannelId">
          <el-option v-for="(zone, index) in zones" :key="zone.id" :label="zone.name" :value="zone.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="警告类型" prop="alarmType">
        <el-select v-model="queryParams.alarmType" placeholder="请选择警告类型" @change="setOptionALarmCategory($event, false)">
          <el-option v-for="(item, index) in optionSelectAlarmType" :key="item.alarmValue" :label="item.alarmLabel"
            :value="item.alarmValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警分类" prop="alarmCategory">
        <el-select v-model="queryParams.alarmCategory" placeholder="请选择告警分类" ref="alarmCategory" clearable
          :disabled="isAble">
          <el-option v-for="(item, index) in optionAlarmCategory" :key="item.alarmValue" :label="item.alarmLabel"
            :value="item.alarmValue" />
        </el-select>
      </el-form-item>

      <el-form-item label="警告时间" prop="warningTime">
        <el-date-picker clearable v-model="queryParams.warningTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择警告时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable>
          <el-option v-for="dict in sys_data_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="daterangeCreateTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-date-picker v-model="daterangeUpdateTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>



    <el-table v-loading="loading" :data="alarmList">

      <el-table-column label="主机名称" align="center" prop="hostName" />

      <el-table-column label="通道名称" align="center" prop="channelName" />

      <el-table-column label="分区名称" align="center" prop="channelZoneName" />
      <el-table-column label="警告编号" align="center" prop="alarmId" />
      <el-table-column label="警告类型" align="center" prop="alarmType">
        <template slot-scope="scope">
          <el-tag type="info">{{ getAlarmLabel(scope.row.alarmType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="告警分类" align="center" prop="alarmCategory">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.alarmCategory">{{ getAlarmCategoryLabel(scope.row.alarmCategory) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="起始位置" align="center" prop="startPosition" />
      <el-table-column label="结束位置" align="center" prop="endPosition" /><el-table-column label="警告时间" align="center"
        prop="warningTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warningTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status == "1" ? "已处理" : "未处理" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text"  icon="el-icon-edit"
            @click="handlerboxin(scope.row)">查看波形图</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog title="波形图" :visible.sync="RealTimeDialog" width="50%">
      <BusinessIncome :infor="dialogBusinessIncome" :buttonShow="false"></BusinessIncome>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="RealTimeDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BusinessIncome from "../BusinessIncome/index";
// 分页组件
import Pagination from "@/components/Pagination";
import api from "@/api/api";
export default {
  name: "Alarm",
  components: {
    BusinessIncome,
    Pagination
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 报警记录表格数据
      alarmList: [],
      pipeLineList: [],
      channelList: [],
      zones: [],
      pipeLineList1: [],
      channelList1: [],
      zones1: [],
      // 弹出层标题
      title: "",
      isAble: true,
      isAbleForAdd: true,
      // 是否显示弹出层
      open: false,
      // 默认为添加功能，为true则表示修改窗口。
      flag: false,
      optionAlarmCategory2: [],
      optionSelectAlarmType: [],
      optionAlarmCategory: [],
      optionAlarmCategory1: [],
      // 是否删除时间范围
      daterangeCreateTime: [],
      // 是否删除时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
      sys_data_status: [{
        label: '已处理',
        value: '1'
      }, {
        label: '未处理',
        value: '0'
      }],
      RealTimeDialog: false,
      dialogBusinessIncome: {
        name: [],
        value: [],
        value2: [{ name: "", type: "line", data: [] }],
      },
    };
  },
  created() {
    this.queryParams.hostId = null;
    this.queryParams.channelId = null;
    this.queryParams.channelZoneId = null;
    this.loadPipleLineInfo();
    this.setOptionAlarms();
    this.getList();
  },
  methods: {
    handlerboxin(row) {
      this.getboxingData(row)
      this.RealTimeDialog = true
    },
    getboxingData(data) {
      let query = {
        pageNum: 1,
        pageSize: 1,
        createTime: data.createTime
      }
      api.alarmRealTimeData(query).then(res => {
        if (res.rows && res.rows[0]) {
          let item = res.rows[0]
          let xdata = [];
          let sevsor = eval(item.sensor)
          for (let index = 0; index < sevsor.length; index++) {
            xdata.push(index);
          }
          this.dialogBusinessIncome.name = xdata;
          this.dialogBusinessIncome.value2[0].name = item.channelNo;
          this.dialogBusinessIncome.value2[0].data = sevsor;
        }
      })
    },
    /** 查询报警记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      api.alarmList(this.queryParams).then(response => {
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        alarmId: null,
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
        delFlag: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
      };
      this.resetForm("form");
    },
    loadPipleLineInfo() {
      //给下拉框赋值，主机、通道、分区等信息
      api.listPipleLine().then(response => {
        this.pipeLineList = response.data;
        this.pipeLineList1 = response.data;
        this.loading = false;
      });
    },
    selectChannel(data) {
      for (let a = 0; a < this.pipeLineList.length; a++) {
        if (data == this.pipeLineList[a].id) {
          this.channelList = this.pipeLineList[a].subTreeNodes;
        }
      };
      this.loading = false;
    },
    selectZone(data) {
      for (let a = 0; a < this.channelList.length; a++) {
        if (data == this.channelList[a].id) {
          this.zones = this.channelList[a].subTreeNodes;
        }
      };
      //this.loading = false;
    },
    getChannel(data) {
      for (let a = 0; a < this.pipeLineList1.length; a++) {
        if (data == this.pipeLineList1[a].id) {
          this.channelList1 = this.pipeLineList1[a].subTreeNodes;
        }
      };
      this.loading = false;
    },
    getZone(data) {
      for (let a = 0; a < this.channelList1.length; a++) {
        if (data == this.channelList1[a].id) {
          this.zones1 = this.channelList1[a].subTreeNodes;
        }
      };
      //this.loading = false;
    },
    getLabel(label, flag) {
      switch (flag) {
        case 1: this.form.hostName = label; break;
        case 2: this.form.channelName = label; break;
        case 3: this.form.channelZoneName = label; break;
        default: break;
      }
    },
    setChannelId(data) {
      this.$set(this.queryParams, this.queryParams.channelZoneId, data);
    },
    /** 给警告类型和警告分类下拉框赋值，类似字典的取值功能 */
    setOptionAlarms() {
      api.optionsAlarmType().then(response => {
        this.optionSelectAlarmType = response.data;
      });
      api.optionsAlarmCategory().then(response => {
        this.optionAlarmCategory2 = response.data;
        // alert("****"+ this.optionAlarmCategory2);
      });

    },
    setOptionALarmCategory(data, flag) {
      //如果警告类型为告警则初始化告警分类下拉框
      if (data == 3) {
        api.optionsAlarmCategory().then(response => {
          if (flag) {
            this.isAbleForAdd = false;
            this.optionAlarmCategory1 = response.data;
          } else {
            this.isAble = false;
            this.optionAlarmCategory = response.data;
          };
        });
      } else {
        if (flag) {
          this.isAbleForAdd = true;
          this.form.alarmCategory = "";
        } else {
          this.queryParams.alarmCategory = "";
          this.isAble = true;
        };
      };

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadPipleLineInfo();
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.queryParams.hostId = null;
      this.queryParams.channelId = null;
      this.queryParams.channelZoneId = null;
      this.resetForm("queryForm");
      this.handleQuery();
      this.loadPipleLineInfo();
    },

  }
};
</script>
