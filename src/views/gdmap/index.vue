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
import { debounce } from "loadsh";
import { ba_gd } from "@/utils/map";
import InformationPanel from "@/views/Map/Panel/InformationPanel";

window._AMapSecurityConfig = {
  securityJsCode: "83d32f3ed10df19e1715137b322f990b", //你的安全密钥
};
export default {
  name: "Map",
  props: {
    center: {
      type: Array,
      default: () => [116.397428, 39.90923],
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
      zhujiicon: null,
      waisheicon: null,
      isShow: false, //弹窗
      myTitleName: "", //弹窗名称
      myDataList: [],
      infoWindow: null,
    };
  },
  async mounted() {
    this.initMap();
    this.initIcon();
  },
  methods: {
    initIcon() {},
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
          center: this.center,
          mapStyle: "amap://styles/darkblue",
          showIndoorMap: false,
        });
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
        this.getMarkerData();
      });
    },
    getMarkerData() {
      this.marker = [];
      //   api.aideDeviceList().then((res) => {
      //     this.addMaker(res.rows, "waishe");
      //   });

      api.hostManageList().then((res) => {
        this.addMaker(res.rows, "zhuji");
      });
    },
    addMaker(data, type) {
      var _this = this,
        el = document.getElementById("informationPanel");
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: el,
        offset: new AMap.Pixel(0, -30),
      });
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
            .on(
              "mouseover",
              debounce(function (e) {
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
              }, 200)
            );
          _this.map.add(marker);
          _this.marker.push(marker);
        }
      });
    },
    addline(pointData) {
      const polyline = new AMap.Polyline({
        path: pointData,
        strokeColor: "#FF0000",
        strokeWeight: 2,
        map: map,
      });
      map.add(polyline);
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