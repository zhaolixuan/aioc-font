<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { clogin } from "@/api/login";
import { setToken } from "@/utils/auth";

export default {
  name: "App",
  mounted() {
    let username = "admin";
    let password = "admin123";
    clogin(username, password).then((res) => {
      setToken(res.token);
      this.$router.push({ path: this.redirect || "/" });
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html::-webkit-scrollbar {
  width: 0;
}
ul,
li {
  list-style: none;
}
html,
body {
  height: 100%;
  width: 100%;
  font-family: "Microsoft Yahei";
}
#app {
  height: 100%;
  width: 100%;
}
/*#app>div{*/
/*height: 100%;*/
/*}*/
.nav_btn {
  background: url("assets/image/nav_btn.png") no-repeat;
  width: 0.57rem;
  height: 0.77rem;
  background-size: 0.57rem 0.77rem;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  z-index: 999;
}
/* .el-dialog__body{
    height: 100%!important;
    padding: 0;
  }
  .el-dialog__header{
    position: absolute;
    padding: 0;
    z-index: 999;
    width: 100%;
  } */
#bgFrame {
  border: 0;
}
.v-modal {
  /* display: none; */
  background: rgb(185, 185, 185);
  /* background: rgb(255,255,255,0.8); */
  /* background-color: aqua; */
  opacity: 0.8;
}
</style>
