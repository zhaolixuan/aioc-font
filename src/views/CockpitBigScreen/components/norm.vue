<template>
  <div class="norm">
    <div class="title" v-if="icon === 1 || icon === 5">
      <img src="@/views/CockpitBigScreen/assets/trend.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 2">
      <img src="@/views/CockpitBigScreen/assets/icon2.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 3">
      <img src="@/views/CockpitBigScreen/assets/top5.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 4">
      <img src="@/views/CockpitBigScreen/assets/icon4.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 6">
      <img src="@/views/CockpitBigScreen/assets/6icon.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 'fwq'">
      <img src="@/views/CockpitBigScreen/assets/icon_fwq.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 'zd'">
      <img src="@/views/CockpitBigScreen/assets/icon_zd.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 'ai'">
      <img src="@/views/CockpitBigScreen/assets/icon_ai.png" />{{ title }}
      <p></p>
    </div>
    <div class="title" v-if="icon === 'alarm'">
      <img src="@/views/CockpitBigScreen/assets/icon_alarm.png" />{{ title }}
      <p></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "norm",
  props: {
    title: {
      type: String,
    },
    icon: Number|String,
  },
};
</script>
<style lang="less" scoped>
.norm {
  width: 100%;
  background-size: 100% 100%;
  padding-left: 0.2rem;
  line-height: 0rem;
  .title {
    min-width: 1rem;
    max-width: 100%;
    line-height: 0.35rem;
    height: 0.35rem;
    display: inline-block;
    font-size: 0.2rem;
    color: #e2feff;
    font-family: "STSongti-SC-Bold";
    img {
      width: 0.2rem;
      height: 0.2rem;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
    p {
      height: 1px;
      width: 100%;
      background: linear-gradient(
        117deg,
        rgba(44, 178, 255, 0) 0%,
        #2cb2ff 53%,
        rgba(44, 178, 255, 0) 100%
      );
    }
  }
}
</style>
