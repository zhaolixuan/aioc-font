<template>
  <div class="ShopNumber_wrap">
    <div class="card_wrap">
      <norm title="服务器系统状态" :icon="6" />
    </div>
    <div class="dark_table">
      <el-table :data="infor">
        <el-table-column   width="auto" label="模块名称" align="center" prop="moduleName" />
        <el-table-column    width="46" label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{ !scope.row.status == "1" ? "异常" : "正常" }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          width="auto" 
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.updateTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:sysStatus:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bussiness:sysStatus:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
import api from "@/api/api";
import norm from "../norm";
export default {
  name: "ShopNumber",
  components: { norm },
  props: {
    infor: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  created() {},

  watch: {},
  methods: {},
};
</script>
<style>
.el-table,
.el-table tr {
  background-color: transparent !important;
  border-bottom: none;
}

.el-table thead tr th {
  background-color: transparent !important;
  background: rgba(85, 187, 255, 0.26) !important;
  color: #fff;
  padding: 0px 0px !important;
  height: 0.36rem !important;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px !important;
}

.el-table td {
  padding: 0 0 !important;
  height: 0.36rem !important;
  color: #b6dcff !important;
}

.el-table .el-table_body tr th:hover {
  background: transparent !important;
}

.el-table tr:nth-child(even) {
  background: rgba(85, 187, 255, 0.1) !important;
}

.el-table tr:hover td {
  background: transparent !important;
}

.el-table tr td .cell {
  font-size: 0.14rem;
}

.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden !important;
}
</style>
<style lang="less" scoped>
.ShopNumber_wrap {
  height: 25%;

  .card_wrap {
    margin-top: -0.25rem;
    position: relative;

    .tab_wrap {
      position: absolute;
      right: 15%;
      top: 0.18rem;
      height: 0.24rem;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        cursor: pointer;
        width: 0.8rem;
        height: 0.3rem;
        line-height: 0.3rem;
        display: inline-block;
        font-size: 0.12rem;
        background: url("../../assets/tab.png") no-repeat;
        background-size: 100% 100%;
        color: #75bdf4;
        text-align: center;
      }

      .left {
        background: url("../../assets/active_tab.png") no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }

      .right {
        background: url("../../assets/active_tab.png") no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
  }

  .dark_table {
    margin-top: 0.2rem;
    // margin-left: -15%;
    /deep/ .el-table__body-wrapper {
      width: 100%;
      height: 1.6rem;
      overflow: auto;
      overflow-x: hidden !important;
    }
  }

  .btn {
    padding: 2px 6px;
    border: 1px solid #ddd;
    background: #171616;
  }
}
</style>
