<template>
  <div class="EnterpriseNumber">
    <div class="infor_wrap">
      <div class="infor_item">
        <p class="name">当前报警数量</p>
        <p class="num">{{ num }}</p>
      </div>
    </div>
    <div class="thorough">
      <div v-for="i in infor" :key="i.hostId" class="thorough_item">
        <span
          :class="curHost == i.hostId ? 'cative' : ''"
          @click="handlerHostClick(i)"
          >{{ i.hostName }}：{{ i.hostNo }}</span
        >
        <!-- <p class="line" :style="`background-color:${index == 0 ? 'yellow' : 'blue'} ;`"></p> -->
        <!-- <p class="name">{{ i.hostName }}</p> -->
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
    num: {
      type: Number,
    },
  },
  data() {
    return {
      showTable: false,
      id: 1,
      curHost: null,
    };
  },
  created() {},
  watch: {
    infor: {
      deep: true,
      handler(n) {},
    },
  },
  mounted() {
    console.log(this.infor);
    this.curHost = this.infor && this.infor[0].hostId;
  },
  methods: {
    handlerHostClick(data) {
      this.curHost = data.hostId;
      this.$emit("handlerHostClick", data);
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
  justify-content: center;

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
      font-size: 0.4rem;
      color: red;
      margin-top: 0.2rem;
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

  .thorough {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;

    .thorough_item {
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      cursor: pointer;
      color: #fff;
      .cative {
        color: #a8e7f6;
        // width: 0.7rem;
      }

      .name {
        color: #fff;
      }

      .line {
        height: 3px;
        width: 0.5rem;
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
