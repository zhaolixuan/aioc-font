<template>
  <div class="header_wrap">
    <div class="address"></div>
    <div class="infor" style="padding-left: 5%; box-sizing: border-box">
      <p class="item_infor">
        <el-button
          size="small"
          type="text"
          :class="openAnfang ? 'active warningBtn' : 'warningBtn'"
          @click="handelrOpenAnfang"
          >{{ openAnfang ? "一键撤防" : "一键布防" }}</el-button
        >
      </p>
      <p class="item_infor">
        <el-button
          size="small"
          type="text"
          :class="openShishi ? 'active warningBtn' : 'warningBtn'"
          @click="handelrOpenShi"
          >{{ openShishi ? "关闭实时监控" : "开启实时监控" }}</el-button
        >
      </p>
    </div>
    <p class="title">周界预警监测系统</p>
    <div class="infor right">
      <p class="item_infor">{{ currentData + "  " + currentTime }}</p>

      <el-dropdown @command="handleLogin" class="title_dropdown">
        <p class="item_infor">
          {{ urseName }}
          <img src="../assets/quit.svg" alt="" />
        </p>
        <el-dropdown-menu slot="dropdown" class="op-dropdown">
          <el-dropdown-item class="op-dropdown-item">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { removeToken } from "@/utils/token-util";

export default {
  name: "Header",
  props: {
    infor: {
      type: [Array, Object],
    },
    isInfor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dataObj: {},
      currentData: "",
      currentTime: "",
      time: null,
      openShishi: true,
      openAnfang: true,
    };
  },
  computed: {
    urseName() {
      return this.$store.state.activeName || "";
    },
  },
  created() {},
  watch: {
    infor: {
      deep: true,
      handler() {
        this.dataObj = this.infor;
      },
    },
  },
  mounted() {
    this.navDate();
    this.time = setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
    handelrOpenShi() {
      this.openShishi = !this.openShishi;
      this.$emit("handelrOpenShi", this.openShishi);
    },
    handelrOpenAnfang() {
      this.openAnfang = !this.openAnfang;
      this.$emit("handelrOpenAnfang", this.openAnfang);
    },
    handleLogin(command) {
      this.loginOut();
    },
    loginOut() {
      removeToken();
      this.$router.push({ path: "/login" });
    },
    navDate() {
      let now = new Date();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let week = weeks[now.getDay()];
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.currentData = month + "月" + day + "日" + " 星期" + week;
      this.updateTime();
    },
    updateTime() {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      this.currentTime = `${this.formatTime(hours)}:${this.formatTime(
        minutes
      )}:${this.formatTime(seconds)}`;
    },
    formatTime(time) {
      return time < 10 ? `0${time}` : time;
    },
  },
  destroyed() {
    clearInterval(this.time);
  },
};
</script>
<style lang="less" scoped>
.header_wrap {
  width: 100%;
  height: 100%;
  background: url("../assets/head_bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 0rem 0.15rem;
  box-sizing: border-box;
  display: flex;
  .address {
    color: #fff;
    font-size: 0.16rem;
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
    width: 22%;
    height: 1rem;
    margin: 0 auto;
    font-size: 0.36rem;
    color: #ffffff;
    line-height: 1rem;
    text-align: center;
    text-shadow: 0px 0.04rem 0.4rem #003858;
    font-family: "PingFangSC-Regular";
  }
  .infor {
    display: inline-block;
    width: 36%;
    height: 0.5rem;
    margin-top: 0.2rem;
    line-height: 0;
    font-size: 0rem;
    text-align: left;
    display: flex;
    justify-content: space-around;
    align-content: center;
    &:first-child {
      text-align: right;
      padding-right: 0.3rem;
      box-sizing: border-box;
    }
    .item_infor {
      font-size: 0.14rem;
      // height: 1rem;
      // line-height: 1rem;
      color: #e2feff;
      // margin-left: 0.3rem;
      display: inline-block;
      font-family: "PingFangSC-Medium";
      // flex: 1;
      align-items: center;
      display: flex;
      justify-content: center;
    }
    .value {
      font-size: 0.2rem;
      color: #fff;
      margin-left: 0.05rem;
    }
    .unit {
      font-size: 0.14rem;
      color: #fff;
    }
    .warningBtn {
      border: 1px solid #ccc;
      color: #fff;
      padding: 10px 18px;
    }
    .active {
      border: 1px solid #36a2da;
      color: #fff;
      background: rgba(54, 162, 218, 0.5);
    }
  }
}
.title_dropdown {
  display: flex;
  align-items: center;
}
.op-dropdown {
  padding: 1px;
  margin: 8px 0 0 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: linear-gradient(180deg, #082857 0%, #091827 100%) !important;
  box-shadow: 0px 4px 8px rgba(4, 17, 38, 0.4);
  border-radius: 0;
}

.op-dropdown .op-dropdown-item {
  background-color: transparent;
  color: #fff;
}

.op-dropdown .op-dropdown-item:hover {
  background-color: rgba(0, 194, 255, 0.1);
  color: #ffffff;
}

.op-dropdown .popper__arrow {
  display: none;
}
</style>
