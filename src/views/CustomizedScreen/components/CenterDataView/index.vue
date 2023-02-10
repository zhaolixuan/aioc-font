<template>
  <div class="EnterpriseNumber">
    <div v-for="item in inforList" :key="item.id" class="infor_wrap">
      <p class="img"><img :src="item.url" class="imgs"> </p>
      <div class="infor_item">
        <div @mouseover.prevent="handleMouseover(item.name)" @mouseout.prevent="handleMouseout">
          <p class="num">{{item.num}}<span class="unit">{{item.unit}}</span></p>
          <p class="name">{{item.name}}</p>
        </div>
        <div v-if="item.tbName" style="margin-left:.15rem;">
          <p class="num1">{{item.num1}}<span class="unit">%</span></p>
          <p class="name" style="margin-top: 0.06rem;">{{item.tbName}}
            <img src="../../assets/high.png" v-if="item.num1 >= 0">
            <img src="../../assets/low.png" v-if="item.num1 < 0">
          </p>
        </div>
      </div>
    </div>
     <div class="tableBox" v-show="showTable">
          <p class='title'>各市排名</p>
          <el-table :data="tableData" style="width: 80%" class="tables">
            <el-table-column align="left" prop="rank" width="48" label="排名">
            </el-table-column>
            <el-table-column align="left" prop="city" label="地市级" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="left" prop="salesamountRatio" label="占比" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  {{scope.row.salesamountRatio}}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
  </div>
</template>
<script>
export default {
  name: 'CenterDataView',
  props: {
    infor: {
      type: [Object, Array]
    },
    list: {
      type: Array
    }
  },
  data () {
    return {
      showTable: false,
      id: 1,
      tableData: [],
      inforList: [
        {
          id: 1,
          name: '累计网络零售额',
          num: 0,
          unit: '万元',
          url: require('../../assets/lj.png'),
          tbName: '同比',
          num1: '0'
        }, {
          id: 2,
          name: '全省占比',
          num: 0,
          unit: '%',
          url: require('../../assets/zb.png')
        }, {
          id: 3,
          name: '全省排名',
          num: 0,
          unit: '名',
          url: require('../../assets/pm.png')
        }, {
          id: 4,
          name: '当月网络零售额',
          num: 0,
          unit: '万元',
          url: require('../../assets/dy.png')
        }
      ]
    }
  },
  created () {
    this.inforList[0].num = this.infor.salesamountCount || 0
    this.inforList[0].num1 = this.infor.salesamountMomCount || 0
    this.inforList[1].num = this.infor.ratio || 0
    this.inforList[2].num = this.infor.rank || 0
    this.inforList[3].num = this.infor.salesamountMonthsCount || 0
    this.tableData = this.list
  },
  watch: {
    infor: {
      deep: true,
      handler () {
        this.inforList[0].num = this.infor.salesamountCount || 0
        this.inforList[0].num1 = this.infor.salesamountMomCount || 0
        this.inforList[1].num = this.infor.ratio || 0
        this.inforList[2].num = this.infor.rank || 0
        this.inforList[3].num = this.infor.salesamountMonthsCount || 0
        this.tableData = this.list
      }
    }
  },
  methods: {
    handleMouseover (name) {
      if (name === '全省排名') {
        this.showTable = true
      }
    },
    handleMouseout () {
      this.showTable = false
    }
  }
}
</script>
<style>
.el-table,
.el-table tr {
  background-color: transparent !important;
  border-bottom: none;
}
.el-table thead tr th {
  background-color: transparent !important;
  background: rgba(0,81,127,0.22)!important;
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
 background: rgba(0,81,127,0.22)!important;
}
.el-table tr:hover td {
  background: transparent !important;
}
.el-table tr td .cell {
  font-size: .12rem;
}
.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden!important;
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
   .tableBox {
        width: 2.94rem;
        min-height: 2.2rem;
        background: url('../../assets/pmbg.png') no-repeat;
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
    align-items: center;
    margin-right: 0.2rem;
    color: #fff;
    line-height: 0.25rem;
    cursor: pointer;
    .infor_item {
      display: flex;
    }
    .name {
      font-size: 0.18rem;
      color: #a8e7f6;
    }
    .num1 {
      font-size: 0.24rem;
    }
    .num {
      font-size: 0.24rem;
      .unit {
        font-size: 0.14rem;
      }
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
    flex: 2
  }
}
</style>
