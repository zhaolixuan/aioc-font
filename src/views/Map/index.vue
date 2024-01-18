<template>
  <div style="height: 100%; width: 100%">
    <div id="map"></div>
    <div class="map-mask"></div>

    <information-panel
      id="informationPanel"
      v-show="isShow"
      :titleName="myTitleName"
      :dataList="myDataList"
    ></information-panel>
  </div>
</template>
   
  <script>
import api from "@/api/api";
import AMapLoader from "@amap/amap-jsapi-loader";
import { debounce, throttle } from "loadsh";
import { ba_gd, wgs84togcj02 } from "@/utils/map";
import InformationPanel from "./Panel/InformationPanel";
import { obtainZone } from "@/utils/pointiInZone";

window._AMapSecurityConfig = {
  securityJsCode: "83d32f3ed10df19e1715137b322f990b", //你的安全密钥
};
export default {
  name: "Map",
  props: {
    mapCenter: {
      type: String,
      default: '116.38821589024599|39.97533303800978'
    },
    zoom: {
      type: Number,
      default: 13,
    },
  },
  components: {
    InformationPanel,
  },
  data() {
    return {
      map: null,
      marker: [],
      lines: [],
      zhujiicon: null,
      waisheicon: null,
      isShow: false, //弹窗
      myTitleName: "", //弹窗名称
      myDataList: [],
      infoWindow: null,
      optionSelectAlarmType: null,
      zoneList:[]
    };
  },
  watch: {
    mapCenter: {
      deep: true,
      handler: function (data) {
        console.log(data);
        if (!data) return;
        if (this.map) {
          this.map.panTo(data.split("|"), 500);
        }
      },
    },
  },
  async mounted() {
    this.initMap();
    this.initData();
  },
  methods: {
    handelgive(data = {}) {
      let arr = obtainZone(data, this.zoneList);
      arr.forEach((i) => {
        this.getliner(i.id, data);
      });
    },
    initData() {
      this.setOptionAlarms();
    },
    initMap() {
      let load = AMapLoader.load({
        key: "83d32f3ed10df19e1715137b322f990b", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          "AMap.DistrictSearch",
          "AMap.PolyEdito",
          "AMap.MouseTool",
          "AMap.Autocomplete",
          "AMap.PlaceSearch",
        ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.map = new AMap.Map("map", {
          zoom: this.zoom,
          center: this.mapCenter && this.mapCenter.split('|'),
          mapStyle: "amap://styles/darkblue",
          showIndoorMap: false,
        });
        window.map = this.map;
        this.zhujiicon = new AMap.Icon({
          size: new AMap.Size(32, 32), // 设置图标大小
          image: require(`../../assets/image/zhuji.png`), // 设置图标路径
          imageSize: new AMap.Size(32, 32), // 设置图标显示大小
        });
        this.waisheicon = new AMap.Icon({
          size: new AMap.Size(32, 32), // 设置图标大小
          image: require(`../../assets/image/waishe.png`), // 设置图标路径
          imageSize: new AMap.Size(32, 32), // 设置图标显示大小
        });

        let el = document.getElementById("informationPanel");
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true,
          content: el,
          offset: new AMap.Pixel(0, -30),
        });

        this.getMarkerData();
        this.addline();
      });
    },
    getMarkerData() {
      this.marker = [];
      api.aideDeviceList().then((res) => {
        this.addMaker(res.rows, "waishe");
      });

      api.hostManageList().then((res) => {
        this.addMaker(res.rows, "zhuji");
      });
    },
    addMaker(data, type) {
      var _this = this;

      data.forEach((item, index) => {
        if (item !== undefined) {
          var lnglat;
          if (type == "zhuji") {
            lnglat = item.latiscope && item.latiscope.split("|");
          } else if (type == "waishe") {
            lnglat = item.latitude && item.latitude.split("|");
          }
          if (!lnglat) return;
          const marker = new AMap.Marker({
            icon: this[`${type}icon`],
            position: ba_gd(lnglat),
            anchor: "bottom-center",
            id: item.aideDeviceId,
            extData: {
              name: item.hostName,
              labelName: item.hostName,
              region: item.region || "",
              hostId: item.hostId || "",
              channelName: item.channelName || "",
              channelZoneName: item.channelZoneName || "0",
              ip: item.ip || "",
            },
          })
            .on(
              "mouseout",
              debounce(function () {
                console.log("mack移除");
                _this.isShow = false;
                _this.infoWindow.close();
              }),
              200
            )
            .on("mouseover", function (e) {
              let properties = e.target.getExtData();
              _this.isShow = true;
              _this.myTitleName = properties.name;
              _this.myType = properties.type;
              if (type == "zhuji") {
                _this.myDataList = [
                  {
                    fieldName: "主机ID",
                    value: properties.hostId,
                  },
                  {
                    fieldName: "所属地区",
                    value: properties.region,
                  },
                ];
              } else {
                _this.myDataList = [
                  {
                    fieldName: "所属通道",
                    value: properties.channelName,
                  },
                  {
                    fieldName: "所属分区",
                    value: properties.channelZoneName,
                  },
                  {
                    fieldName: "ip地址",
                    value: properties.ip,
                  },
                ];
              }
              _this.infoWindow.open(_this.map, e.target.getPosition());
            });
          _this.map.add(marker);
          _this.marker.push(marker);
        }
      });
    },
    addline() {
      this.lines = []
      var _this = this;
      api.zoneList().then((res) => {
        console.log('res',res);
        if (!res.rows.length) return;
        this.zoneList = res.rows;
        res.rows.forEach((item) => {
          if (item.latscope) {
            var reg = new RegExp("\n", "g");
            let resData = item.latscope.replace(reg, "").split(",");
            let pointData = [];
            resData.forEach((j) => {
              let resData_item = ba_gd(j.split("|"));
              if (resData_item.length) {
                pointData.push([resData_item[0] * 1, resData_item[1] * 1]);
              }
            });
            const polyline = new AMap.Polyline({
              path: pointData,
              strokeColor: "#1bbc9b",
              strokeWeight: 5,
              extData: {
                name: item.channelZoneName,
                channelStartNum: item.channelStartNum,
                channelName: item.channelName,
                channelEndNum: item.channelEndNum,
                pointDataStart: pointData[0],
                pointDataEnd: pointData[pointData.length - 1],
              },
            })
              .on(
                "mouseout",
                debounce(function () {
                  console.log("line移除");
                  _this.infoWindow.close();
                  _this.isShow = false;
                }, 200)
              )
              .on("mouseover", function (e) {
                let properties = e.target.getExtData();
                _this.isShow = true;
                _this.myTitleName = properties.name;
                _this.myDataList = [
                  {
                    fieldName: "所属通道",
                    value: properties.channelName,
                  },
                  {
                    fieldName: "分区起点：",
                    value: properties.channelStartNum,
                  },
                  {
                    fieldName: "分区终点：",
                    value: properties.channelEndNum,
                  },
                ];
                _this.infoWindow.open(_this.map, [e.lnglat.lng, e.lnglat.lat]);
              });
            _this.map.add(polyline);
            _this.lines.push({ id: item.channelZoneId, polyline: polyline });
          }
        });
      });
    },

    getliner(id, data) {
      let _this = this;
      let targetPolyline = this.lines.find((i) => i.id == id);
      if (targetPolyline) {
        targetPolyline.polyline.setOptions({
          strokeColor: "red",
          extData: {
            warningTime: data.warningTime,
            channelStartNum: data.startPosition,
            channelEndNum: data.endPosition,
            alarmType: this.getAlarmLabel(data.alarmType),
            name:data.fenquName
          },
        });
      }

      targetPolyline.polyline.on("mouseover", function (e) {
        let properties = e.target.getExtData();
        _this.isShow = true;
        _this.myTitleName = properties.name;
        _this.myDataList = [
          {
            fieldName: "报警分区：",
            value: properties.name,
          },
          {
            fieldName: "报警点：",
            value:
              properties.channelStartNum +
              "-" +
              properties.channelEndNum,
          },
          {
            fieldName: "报警类型",
            value: properties.alarmType,
          },
        ];
        _this.infoWindow.open(_this.map, [e.lnglat.lng, e.lnglat.lat]);
      });
    },
    getAlarmLabel(data) {
      // alert(data);
      for (let a = 0; a < this.optionSelectAlarmType.length; a++) {
        if (data == this.optionSelectAlarmType[a].alarmValue) {
          return this.optionSelectAlarmType[a].alarmLabel;
          // this.zones = this.channelList[a].subTreeNodes;
        }
      }
    },
    setOptionAlarms() {
      api.optionsAlarmType().then((response) => {
        this.optionSelectAlarmType = response.data;
      });
    },
  },
};
</script>
   
  <style scoped>
#map {
  width: 100%;
  height: 100%;
}
.map-mask {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  bottom: 0;
  right: 0;
  pointer-events: none;
  background-image: url("~@/assets/image/map-mask.png");
  background-size: 100% 100%;
}
</style>