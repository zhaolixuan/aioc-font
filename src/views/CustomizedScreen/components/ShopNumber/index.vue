<template>
  <div class="ShopNumber_wrap">
    <div class="card_wrap">
      <norm title="明星企业及店铺" :icon="6" />
      <div class="tab_wrap">
        <p v-for="item in tabList" :key="item.id" @click="handlerTab(item.id)" :class="item.className">
          {{item.title}}
        </p>
      </div>
    </div>
    <div class="dark_table">
      <el-table :data="tableData" style="width:85%" v-if="title=='明星企业'">
        <el-table-column align="left" prop="rank" label="排名" width="55">
        </el-table-column>
        <el-table-column align="left" prop="entName" label="企业名称" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="materialNetworkSales" width="80" label="零售额" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="shopCount" width="75" label="店铺数"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="district" label="县(市、区)" width="130" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 85%" v-if="title=='明星店铺'">
        <el-table-column align="left" prop="rank" label="排名" width="55">
        </el-table-column>
        <el-table-column align="left" prop="shopName" label="店铺名称" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="materialNetworkSales" width="80" label="零售额" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="mainCategory" width="90" label="主营类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="district" label="县(市、区)"  width="120" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '@/api/api'
import norm from '../norm'
export default {
  name: 'ShopNumber',
  components: { norm },
  props: {
    infor: {
      type: Object
    }
  },
  data () {
    return {
      title: '明星企业',
      tabList: [
        {
          id: 0,
          className: 'left',
          title: '明星企业'
        }, {
          id: 1,
          className: '',
          title: '明星店铺'
        }
      ],
      timer: null,
      allTableData: [],
      tableData: [],
      currrentPage: 1,
      pageSize: 5,
      total: 0,
      totalPages: 0
    }
  },
  created () {
    this.getData()
    this.title = this.tabList[0].title
    this.timer = setInterval(() => {
      let tmpList = this.allTableData.map(item => item)
      const shiftItems = tmpList.splice(0, 5)
      tmpList = tmpList.concat(shiftItems)
      this.allTableData = tmpList
      this.tableData = this.allTableData.slice(0, 5)
    }, 3000)
  },
  destroyed () {
    clearInterval(this.timer)
  },

  watch: {},
  methods: {
    getData () {
      api.getComPanyAndShopList({}).then(res => {
        if (this.title === '明星企业') {
          this.allTableData = res.projectEntList
          this.tableData = this.allTableData.slice(0, 5)
          console.log(res.projectEntList)
          console.log(this.tableData)
        } else if (this.title === '明星店铺') {
          this.allTableData = res.projectShopList
          this.tableData = this.allTableData.slice(0, 5)
        }
      })
    },
    handlerTab (id) {
      this.title = this.tabList[id].title
      if (id === 0) {
        this.tabList[0].className = 'left'
        this.tabList[1].className = ''
      } else {
        this.tabList[0].className = ''
        this.tabList[1].className = 'right'
      }
      this.getData()
    }
  },
  computed: {}
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
  background: rgba(85, 187, 255, 0.26) !important;
  color: #fff;
  padding: 0px 0px !important;
  height: 0.36rem !important;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px !important;
  font-size: .18rem!important;
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
  font-size: .18rem!important;
}
.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden!important;
}
</style>
<style lang="less" scoped>
.ShopNumber_wrap {
  height: 25%;
  .card_wrap {
    margin-top: -.25rem;
    position: relative;
    .tab_wrap {
      position: absolute;
      right: 15%;
      top: 0.18rem;
      height: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        cursor: pointer;
        width: 1rem;
        height: 0.38rem;
        line-height: 0.38rem;
        display: inline-block;
        font-size: 0.18rem;
        background: url('../../../CockpitBigScreen/assets/tab.png') no-repeat;
        background-size: 100% 100%;
        color: #75BDF4;
        text-align: center;
      }
      .left {
        background: url('../../../CockpitBigScreen/assets/active_tab.png') no-repeat;
        background-size: 100% 100%;
        color: #FFFFFF;
      }
      .right {
         background: url('../../../CockpitBigScreen/assets/active_tab.png') no-repeat;
        background-size: 100% 100%;
        color: #FFFFFF;
      }
    }
  }
  .dark_table {
    margin-top: 0.2rem;
    margin-left: 5%;
    font-size: .2rem;
  }
}
</style>
