<template>
  <div class="header_wrap">
    <div class="address">
      <span class="imgBox">
        <img src="../assets/address.png" alt="">
      </span>
      <span class="name">九江</span>
    </div>
    <div class="infor" style="padding-left:5%;box-sizing:border-box;">
      <p class="item_infor">B2C网络零售额
        <span class="value">{{infor.salesamountB2cCount || 0}}</span>
        <span class="unit">万元</span>
      </p>
      <p class="item_infor">C2C网络零售额
        <span class="value">{{infor.salesamountC2cCount || 0}}</span>
        <span class="unit">万元</span>
      </p>
    </div>
    <p class="title">九江市电商产业数据驾驶舱</p>
    <div class="infor">
      <p class="item_infor">实物网络零售额
        <span class="value">{{infor.salesamountMaterialCount || 0}}</span>
        <span class="unit">万元</span>
      </p>
      <p class="item_infor">非实物网络零售额
        <span class="value">{{infor.salesamountNotMaterialCount || 0}}</span>
        <span class="unit">万元</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  props: {
    infor: {
      type: [Array, Object]
    },
    isInfor: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataObj: {}
    }
  },
  created () {},
  watch: {
    infor: {
      deep: true,
      handler () {
        this.dataObj = this.infor
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header_wrap {
  width: 100%;
  height: 100%;
  background: url('../assets/head_bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0rem 0.15rem;
  box-sizing: border-box;
  display: flex;
  .address {
    color: #fff;
    font-size: 0.2rem;
    height: 1rem;
    position: fixed;
    .imgBox {
      display: inline-block;
      width: 0.25rem;
      height: 0.35rem;
      line-height: 1rem;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .name {
      margin-left: 0.1rem;
      line-height: 1rem;
    }
  }
  .title {
    display: inline-block;
    width:22%;
    height: 1rem;
    margin: 0 auto;
    font-size: 0.38rem;
    color: #ffffff;
    line-height: 1rem;
    text-align: center;
    text-shadow: 0px 0.04rem 0.4rem #003858;
    font-family: 'PingFangSC-Regular';
  }
  .infor {
    // display: inline-block;
    width: 36%;
    display: flex;
    height: 1rem;
    line-height: 0;
    font-size: 0rem;
    justify-content: space-between;
    // text-align: left;
    &:first-child {
      text-align: right;
      padding-right: 0.3rem;
      box-sizing: border-box;
    }
    .item_infor {
      flex:1;
      font-size: 0.2rem;
      height: 1rem;
      line-height: 1rem;
      color: #e2feff;
      margin-left: 0.3rem;
      display:inline-block;
      font-family: 'PingFangSC-Medium';
    }
    .value {
      font-size: 0.24rem;
      color: #fff;
      margin-left: 0.05rem;
    }
    .unit {
      font-size: 0.16rem;
      color: #fff;
    }
  }
}
</style>
