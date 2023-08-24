<!--
 * @Author:tjc
 * @Date: 2019-11-22 18:44:42
 * @LastEditTime : 2020-02-07 22:46:03
 * @LastEditors  : tangjuncheng
 * @Description: In User Settings Edit
 * @FilePath: \aioc-front\src\views\IndustryStandard\mine_gl_map\InformationPanel\InformationPanel.vue
 -->
<template>
  <div class="profession-wrapper background-image">
    <div>
      <h6 class="profession-title">{{ titleName }}</h6>
    </div>
  <div>
    <ul class="profession-content">
      <li
        class="profession-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <el-row>
          <el-col :span="2">
            <img src="../../../assets/image/item_icon.png" alt="" />
          </el-col>
          <el-col :span="12">
            <span class="profession-item-field"
              >{{ item.fieldName }}</span
            ></el-col
          >
          <el-col :span="10">
            <span class="profession-item-value"
              >{{ item.value }} {{ item.unit }}</span
            >
   
            </el-col
          >
        </el-row>
      </li>
    </ul>
      </div>

  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
// import { getOrgTownOpenInfo, getOrgVillageOpenInfo } from '@/api/map'

export default {
  name: "informationPanel",
  props: {
    titleName: [String],
    dataList: [Array],
  },
  components: {},
  watch: {
    titleName: {
      immediate: true,
      handler: function () {
        // this.getDataList();
      },
    },
  },
  data() {
    return {
      timer: null,
      myType: "",
    };
  },
  mounted() {
    // this.getDataList(this.type);
  },
  beforeDestroy() {},
  methods: {

  },
};
</script>

<style lang="less" scoped>
.profession-wrapper {
  background-image: url("../../../assets/image/infor-panel.png");
  background-size: contain;
  width: 2.42rem;
  height: 1.93rem;
  .profession-title {
    word-break: keep-all;
    white-space: nowrap;
    padding: 0.13rem 0.5rem 0.1rem 0.5rem;
    text-align: center;
    font-size: 12px;
    
    color: #ffffff;
  }
  .profession-content {
    margin-left: 0.2rem;
    margin-top: -0.765rem;
    .profession-item {
      .el-row {
        /deep/.el-col-2 {
          height: 0.42rem;
        }
        /deep/.el-col-12 {
          height: 0.42rem;
        }
        /deep/.el-col-10 {
          height: 0.42rem;
        }
      }

      .profession-item-field {
        font-size: 0.13rem;
        color: #93fffd;
      }
      .profession-item-value {
        margin-left: -0.3rem;
        font-size: 0.13rem;
        color: #ffffff;
      }
    }
  }
}
</style>
