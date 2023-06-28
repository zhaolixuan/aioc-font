<template>
  <div class="LeaderCockpit">
    <div class="mask_img"><img src="./assets/mask_bg.png" /></div>
    <Map class="map"></Map>
    <div class="section"></div>
    <div class="header">
      <Header :infor="topData" />
    </div>
    <div class="left_wrap">
      <p class="bigTitle_left">
        九江市网零发展
        <!-- <img src="./assets/left_title.png" /> -->
      </p>
      <BusinessIncome :infor="BusinessIncome"></BusinessIncome>
      <TrueTopTen :infor="topTenData"></TrueTopTen>
      <NotGoodNetWork :infor="topFiveData"></NotGoodNetWork>
    </div>
    <div class="right_wrap">
      <p class="bigTitle_right">
        县（市、区）网零发展
        <!-- <img src="./assets/right_title.png" /> -->
      </p>
      <TotalSaleMoney :infor="ljData" :flag="flag" @changeFlag="changeFlag"></TotalSaleMoney>
      <GoodsTypeZB></GoodsTypeZB>
      <ShopNumber></ShopNumber>
    </div>
    <div class="center">
      <CenterDataView :infor="topData" :list="tableList"></CenterDataView>
    </div>
    <div class="left_qyzh">
      <div class="title_box">
        电商企业数
      </div>
      <div class="left_chart">
        <div class="chart_bg"><span class="chart_on"><i>{{topData.salesamountRetailersCount || 0}}家</i></span></div>
      </div>
    </div>
    <div class="right_tdmj">
      <div class="title_box title_box_2">
        店铺数
      </div>
      <div class="right_chart">
        <div class="chart_bg"><span class="chart_on"><i>{{topData.salesamountShopCount || 0}}家</i></span></div>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>
<script>
import api from '@/api/api'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CenterDataView from './components/CenterDataView'
import BusinessIncome from './components/BusinessIncome/index'
import TrueTopTen from './components/TrueTopTen'
import NotGoodNetWork from './components/NotGoodNetWork'
import TotalSaleMoney from './components/TotalSaleMoney'
import GoodsTypeZB from './components/GoodsTypeZB'
import ShopNumber from './components/ShopNumber'
import Map from '../Map/index.vue'
export default {
  name: 'CockpitBigScreen',
  components: {
    Header,
    BusinessIncome,
    Footer,
    CenterDataView,
    Map,
    TrueTopTen,
    NotGoodNetWork,
    TotalSaleMoney,
    GoodsTypeZB,
    ShopNumber
  },
  data () {
    return {
      tableList: [],
      industry: '',
      topData: {},
      GoodsTypeZBData: { name: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], value: [101, 100, 130, 15, 16, 17, 18, 19, 10, 22, 122] },
      BusinessIncome: { name: [], value: [], value2: [] },
      EnterpriseNumber: {},
      content: '',
      topTenData: {
        name: [],
        value: [],
        data: []
      },
      topFiveData: {
        name: [],
        value: [],
        data: []
      },
      ljData: {
        name: [],
        value: [],
        data: [
          {
            district: 0
          },
          {
            district: 0
          },
          {
            district: 0
          }
        ],
        newName: [],
        newValue: []
      },
      flag: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    changeFlag (val) {
      this.flag = val
    },
    getData () {
      api.getAllViewData({}).then(res => {
        if (res.code === 200) {
          this.tableList = res.data.notNetWorkProvinceMap
          this.topData = res.data.returnIndexMap
          this.BusinessIncome.name = res.data.netWorkDevelopeMap.map((item) => {
            return item.name
          })
          // 网络零售额---增速
          this.BusinessIncome.value = res.data.netWorkDevelopeMap.map((item) => {
            return item.salesamountMom
          })
          // 网络零售额
          this.BusinessIncome.value2 = res.data.netWorkDevelopeMap.map((item) => {
            return item.salesamountMonth
          })
          /* top10数据* */
          this.topTenData.name = res.data.netWorkTop10Map.map((item) => {
            return item.oneLevelName
          })
          this.topTenData.value = res.data.netWorkTop10Map.map((item) => {
            return item.materialNetworkSales
          })
          this.topTenData.data = res.data.netWorkTop10Map
          /* top5数据* */
          this.topFiveData.name = res.data.netWorkTop5Map.map((item) => {
            return item.nonMaterialIndustry
          })
          this.topFiveData.value = res.data.netWorkTop5Map.map((item) => {
            return item.materialNetworkSales
          })
          this.topFiveData.data = res.data.netWorkTop5Map
          /* 累计网络零售额数据* */
          // res.data.notNetWorkRankMap.push({
          //   district: '曲周县',
          //   salesamountCount: 1000
          // })
          this.ljData.name = res.data.notNetWorkRankMap.map((item) => {
            return item.district
          })
          this.ljData.value = res.data.notNetWorkRankMap.map((item) => {
            return item.salesamountCount
          })
          this.ljData.data = res.data.notNetWorkRankMap
          this.ljData.newName = res.data.notNetWorkRankMap.map((item) => {
            return item.district
          })
          this.ljData.newName = [...this.ljData.newName.slice(3)]
          this.ljData.newValue = res.data.notNetWorkRankMap.map((item) => {
            return item.salesamountCount
          })
          this.ljData.newValue = [...this.ljData.newValue.slice(3)]
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.LeaderCockpit {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .mask_img {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9;
    pointer-events: none;
    img {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
  .header {
    height: 16%;
    width: 100%;
    position: fixed;
    z-index: 11;
  }
  .footer {
    height: 2.2rem;
    width: 100%;
    position: fixed;
    left: 0rem;
    bottom: -0.05rem;
    z-index: 11;
    pointer-events: none;
  }
  .section {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 12;
    background: url('./assets/main_bg.png') no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
  }
  .left_wrap,
  .right_wrap {
    width: 24%;
    height: 100%;
    position: fixed;
    z-index: 100;
    top: 13.5%;
    .item {
      margin-bottom: 0.15rem;
    }
    .bigTitle_left {
      font-family: 'PingFangSC-Semibold';
      width: 2.7rem;
      height: .15rem;
      background: url('./assets/left_title.png') no-repeat;
      background-size: 100% 100%;
      font-size: 0.16rem;
      color: #e2feff;
      text-shadow: 0 0 2px #00627a;
      line-height: 0.15rem;
      margin-bottom: 0.28rem;
      text-align: center;
      margin-left: 15%;
      margin-top: 5%;
    }
     .bigTitle_right {
      font-family: 'PingFangSC-Semibold';
      width: 3.18rem;
      height: .15rem;
      background: url('./assets/right_title.png') no-repeat;
      background-size: 100% 100%;
      font-size: 0.16rem;
      color: #e2feff;
      line-height: .15rem;
      text-shadow: 0 0 2px #00627a;
      margin-bottom: 0.28rem;
      text-align: center;
      margin-top: 5%;
      margin-left: 15%;
    }
  }
  .center {
    width: 50%;
    height: 0.9rem;
    position: absolute;
    left:0;
    right:0;
    margin: auto;
    margin-top: 1.8rem;
    box-sizing: border-box;
    z-index: 1000;
  }
  .left_wrap {
    left: 4%;
  }
  .right_wrap {
    right: 3%;
  }
}
.map {
  position: absolute;
}
::-webkit-scrollbar {
  width: 0;
}
.left_qyzh {
  position: absolute;
  left: -0.1rem;
  bottom: 0.2rem;
  z-index: 100;
}
.left_qyzh img {
  width: 2.26rem;
  height: 2.53rem;
  display: block;
}
.left_chart {
  position: relative;
  width: 2.26rem;
  height: 2.53rem;
}
.left_chart .chart_bg {
  background: url('./assets/chart.png') no-repeat;
  width: 1.47rem;
  height: 2.35rem;
  background-size: 1.47rem 2.35rem;
  margin-left: 0.4rem;
  position: relative;
}
.left_chart .chart_bg i {
  display: block;
  font-style: normal;
  font-size: 0.12rem;
  position: absolute;
  background: url('./assets/bq_bg.png') no-repeat;
  width: 0.58rem;
  height: 0.24rem;
  background-size: 0.58rem 0.24rem;
  text-align: center;
  line-height: 0.24rem;
  left: 0.3rem;
  top: -0.1rem;
}
.right_chart .chart_bg i {
  display: block;
  font-style: normal;
  font-size: 0.12rem;
  position: absolute;
  background: url('./assets/bq_bg.png') no-repeat;
  width: 0.58rem;
  height: 0.24rem;
  background-size: 0.58rem 0.24rem;
  text-align: center;
  line-height: 0.24rem;
  left: -0.4rem;
  top: -0.05rem;
  transform: scaleX(-1);
  color: #fff;
}
.left_chart .chart_bg .chart_on {
  position: absolute;
  background: url('./assets/chart_on.png') no-repeat bottom;
  width: 1.35rem;
  height: 75%;
  background-size: 1.35rem 2.21rem;
  left: 0.15rem;
  bottom: 0.1rem;
}
.left_chart i {
  color: #fff;
  font-size: 0.12rem;
  position: absolute;
  font-style: normal;
}
.left_chart i.num_1 {
  left: 1.45rem;
  bottom: 0.02rem;
}
.left_chart i.num_2 {
  left: 0.7rem;
  bottom: 0.3rem;
}
.left_chart i.num_3 {
  left: 0.3rem;
  bottom: 1.4rem;
}
.left_chart i.num_4 {
  left: 0;
  bottom: 2.4rem;
}
.left_chart span {
  position: absolute;
  color: #a8e7f6;
  font-size: 0.12rem;
  left: 2rem;
  bottom: 0.2rem;
}

.right_tdmj {
  position: absolute;
  right: -0.1rem;
  bottom: 0.2rem;
  z-index: 100;
}
.right_tdmj img {
  width: 2.75rem;
  height: 2.56rem;
  display: block;
}
.right_chart {
  position: relative;
  width: 2.75rem;
  height: 2.56rem;
}
.right_chart .chart_bg {
  background: url('./assets/chart.png') no-repeat;
  width: 1.47rem;
  height: 2.35rem;
  background-size: 1.47rem 2.35rem;
  position: absolute;
  left: 0.9rem;
  transform: scaleX(-1);
}
.right_chart .chart_bg .chart_on {
  position: absolute;
  background: url('./assets/chart_on.png') no-repeat bottom;
  width: 1.35rem;
  height: 63%;
  background-size: 1.35rem 2.21rem;
  left: 0.15rem;
  bottom: 0.1rem;
  transform: scaleX(1);
}
.right_chart i {
  color: #a8e7f6;
  font-size: 0.12rem;
  position: absolute;
  font-style: normal;
}
.right_chart i.num_1 {
  right: 1.65rem;
  bottom: 0.02rem;
}
.right_chart i.num_2 {
  right: 0.7rem;
  bottom: 0.3rem;
}
.right_chart i.num_3 {
  right: 0.3rem;
  bottom: 1.4rem;
}
.right_chart i.num_4 {
  right: 0;
  bottom: 2.4rem;
}
.right_chart span {
  position: absolute;
  color: #a8e7f6;
  font-size: 0.12rem;
  right: 2rem;
  bottom: 0.12rem;
}
.title_box {
  font-size: 0.14rem;
  color: #fff;
  line-height: 0.22rem;
  margin-bottom: 0.1rem;
  margin-left: 12%;
}
.title_box i {
  background: url('./assets/titicon.png') no-repeat;
  width: 0.22rem;
  height: 0.22rem;
  background-size: 0.22rem 0.22rem;
  float: left;
  margin-right: 0.05rem;
}
.title_box_2 {
  margin-left: 75%;
}
</style>
