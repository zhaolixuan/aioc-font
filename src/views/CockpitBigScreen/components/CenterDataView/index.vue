<template>
  <div class="EnterpriseNumber">
    <div class="infor_wrap">
      <div class="infor_item">
        <p class="name">{{ inforList.name }}</p>
        <p class="num">{{ inforList.num }}</p>
      </div>
    </div>
    <div class="thorough">
      <div v-for="i in thoroughList" :key="i.name" class="thorough_item">
        <span>通道{{ i.index }}：</span>
        <p class="line" :style="`background-color:${i.color} ;`"></p>
        <p class="name">{{ i.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CenterDataView",
  props: {
    infor: {
      type: [Object, Array],
    },
    list: {
      type: Array,
    },
  },
  data() {
    return {
      showTable: false,
      id: 1,
      tableData: [],
      thoroughList: [
        {
          name: "霍尔果斯",
          color: "blue",
          index: 0,
        },
        {
          name: "乌鲁木齐",
          color: "yellow",
          index: 1,
        },
      ],
      inforList: {
        name: "当前报警数量",
        num: 0,
      },
    };
  },
  created() {
    this.inforList.num = this.infor.salesamountCount || 0;
    this.tableData = this.list;
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        this.inforList.num = this.infor.salesamountCount || 0;
        this.tableData = this.list;
      },
    },
  },
  methods: {
    handleMouseover(name) {
      if (name === "全省排名") {
        this.showTable = true;
      }
    },
    handleMouseout() {
      this.showTable = false;
    },
  },
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
  background: rgba(0, 81, 127, 0.22) !important;
  color: #fff;
  padding: 0px 0px !important;
  height: 0.29rem !important;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px !important;
}
.el-table td {
  padding: 0 0 !important;
  height: 0.29rem !important;
  color: #b6dcff !important;
}
.el-table .el-table_body tr th:hover {
  background: transparent !important;
}
.el-table tr:nth-child(even) {
  background: rgba(0, 81, 127, 0.22) !important;
}
.el-table tr:hover td {
  background: transparent !important;
}
.el-table tr td .cell {
  font-size: 0.12rem;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden !important;
}
.tables {
  margin: 10px 15% 0 14%;
}
</style>
<style lang="less" scoped>
.EnterpriseNumber {
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: auto;
  position: relative;
  .tableBox {
    width: 2.94rem;
    min-height: 2.2rem;
    background: url("../../assets/pmbg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: -80%;
    left: 73%;
    .title {
      font-size: 14px;
      color: #fff;
      text-align: center;
      margin-top: 2px;
      margin-left: 15px;
    }
  }
  .infor_wrap {
    display: flex;
    justify-content: center;
    align-items: space-between;
    margin-right: 0.2rem;
    color: #fff;
    line-height: 0.25rem;
    cursor: pointer;
    .infor_item {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-size: 0.28rem;
      color: #a8e7f6;
    }

    .num {
      text-align: center;
      font-size: 0.14rem;
    }
    &:last-child {
      margin-right: 0rem;
    }
    .imgs {
      width: 0.5rem;
      margin-right: 0.1rem;
      img {
        display: block;
      }
    }
  }
  .thorough{
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    .thorough_item{
      display: flex;
      align-items: center;
      font-size: .14rem;
      span{
        color: #a8e7f6;
        width: 0.6rem;
      }
      .name{
        color: #fff;
      }
      .line{
        height: 3px;
        width: .5rem;
        margin-right: .1rem;
      }
    }
  }
  .infor_wrap:nth-child(2) {
    flex: 1;
  }
  .infor_wrap:nth-child(3) {
    flex: 1;
  }
  .infor_wrap:first-child {
    flex: 2;
  }
  .infor_wrap:last-child {
    flex: 3;
  }
}
</style>
