<template>
  <div class="footer_wrap">
    <div class="title">
      <p>Copyright © 2020-2025 JDCloud.com</p>
      <p>版权所有</p>
    </div>
  </div>
</template>
<style lang='less' scoped>
  .footer_wrap{
    width: 100%;
    height: 100%;
    background: url('../assets/footer_bg.png') no-repeat;
    background-size:100% 100%;
    position: relative;
    pointer-events: none;
    .title{
      width: 100%;
      position: absolute;
      bottom: 0.08rem;
      left: 0;
      text-align: center;
      font-size: 0.15rem;
      line-height: 0.22rem;
      color: #AFDEFF;
      p{margin-left: 0.3rem;}
    }
  }
</style>
