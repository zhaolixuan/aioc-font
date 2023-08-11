<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
  *{
    margin:0;
    padding:0;
    list-style: none;
  }
  html::-webkit-scrollbar{
    width:0;
  }
  ul, li {
    list-style: none;
  }
  html,body{
    height: 100%;
    width: 100%;
    font-family:"Microsoft Yahei";
  }
  #app{
    height: 100%;
    width: 100%;
  }
  /*#app>div{*/
    /*height: 100%;*/
  /*}*/
  .nav_btn{
    background: url("assets/image/nav_btn.png") no-repeat;
    width: .57rem;
    height: .77rem;
    background-size: .57rem .77rem;
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
  #bgFrame{
    border:0
  }
  .v-modal{
    display: none;
  }
</style>
