<template>
  <div class="footer_wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="主机">
        <el-select v-model="formInline.region" placeholder="选择基站">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道">
        <el-select v-model="formInline.region" placeholder="选择线路">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分区">
        <el-select v-model="formInline.region" placeholder="选择线路">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报警点">
        <el-select v-model="formInline.region" placeholder="选择基站">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备">
        <el-input-number v-model="formInline.juli" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{ prop: 'startTime', order: 'descending' }"
    >
      <el-table-column
        v-for="(item, index) in tableHeaders"
        :prop="item.prop || ''"
        :label="item.label"
        :width="item.width || ''"
        :key="index"
        :sortable="item.sortable"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '操作'">
            <el-button @click="handelgive(scope)">处理</el-button>
          </template>

          <span v-else>
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeaders: [
        {
          label: "所属基站",
          prop: "affiliatedBaseStation",
          sortable: false,
          width: null,
        },
        {
          label: "线路",
          prop: "line",
          sortable: false,
          width: null,
        },
        {
          label: "中心点距离",
          prop: "centerPointDis",
          sortable: false,
          width: null,
        },

        {
          label: "位置",
          prop: "position",
          sortable: false,
          width: null,
        },

        {
          label: "开始距离到结束距离",
          prop: "stratDisAndEndDis",
          sortable: false,
          width: null,
        },

        {
          label: "开始时间",
          prop: "startTime",
          sortable: true,
          width: null,
        },

        {
          label: "最新时间",
          prop: "newData",
          sortable: true,
          width: null,
        },

        {
          label: "报警次数",
          prop: "policeNum",
          sortable: true,
          width: null,
        },
        {
          label: "识别类型",
          prop: "identifyType",
          sortable: false,
          width: null,
        },

        {
          label: "处理状态",
          prop: "status",
          sortable: false,
          width: null,
        },
        {
          label: "操作",
          prop: "action",
          sortable: false,
          width: null,
        },
      ],
      tableData: [
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-01",
        },
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-02",
        },
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-03",
        },
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-01",
        },
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-02",
        },
        {
          affiliatedBaseStation: "",
          line: "",
          centerPointDis: "",
          position: "",
          stratDisAndEndDis: "",
          startTime: "",
          newData: "",
          policeNum: "",
          IntrusionDirection: "",
          identifyType: "",
          status: "",
          action: "",
          startTime: "2023-01-03",
        },
      ],
      formInline: {},
    };
  },
  methods: {
    onSubmit(){

    },
    handelgive(data) {
      this.$emit("handelgive", data.row);
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
    padding: 0 0.4rem;

    .el-table__body-wrapper {
      height: 1.3rem;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="less">
.el-select-dropdown{
  background-color: rgba(0, 81, 127, 0.22) !important;
  .el-select-dropdown__item{
    color: #fff;
  }
  .el-select-dropdown__item.selected{
    color: #409EFF;
  }
}
.el-button{
  background: transparent !important;
    color: #fff !important;
    padding: 10px 12px;
}
</style>