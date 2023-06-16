<template>
  <div style="height: 100%; width: 100%">
    <div id="map" class="map"></div>
    <div class="map-mask"></div>
    <InformationPanel
      id="informationPanel"
      v-show="isShow"
      :titleName="myTitleName"
      :dataList="myDataList"
      :type="myType"
    ></InformationPanel>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import api from "@/api/api";
import * as THREE from "three";

// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { UnrealBloomPass } from "./js/UnrealBloomPass"; //必须引用本地库
import { debounce } from "loadsh";
import { MeshLineMaterial } from "./js/THREE.MeshLine";
import SpriteLine from "./feature/SpriteLine";
import Water from "./feature/Water";
import CoolWater from "./feature/CoolWater";

import RippleWall from "./feature/RippleWall";

import { lineLength } from "./js/geoutil";

// import RingEffect from './feature/RingEffect'
// import ElectricShield from './feature/ElectricShield'

import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
import { ThreeLayer } from "maptalks.three/dist/maptalks.three.js"; //必须按这种方式import
import Rotate from "./js/rotate";
import mapboxgl from "mapbox-gl";
import { reshader } from "@maptalks/gl";

import { MapboxglLayer } from "maptalks.mapboxgl";
var bound = require("./data/boundPolygon.json");
import roads from "./data/roads.json";
import centerPoint from "./data/bound_centerpoint.json";
import InformationPanel from "./Panel/InformationPanel";
import waterJson from "./data/water.json";
// import {
//   EffectLayer,
//   EffectMarker,
//   GLTFLayer,
//   GLTFMarker
// } from "@maptalks/gltf-layer";
import centerPointData from "./data/centerPoints.js";
const edgeColor = "#87CEFA";
const polygonColors = ["#C0C0C0", "#00BAB7"];
export default {
  name: "MainMap",
  props: {
    bussineType: [String] //业务类型:一张图 militaryaffairs，
  },
  data() {
    return {
      rotateObj: null, // 地图旋转
      isShow: false, //机构概况弹窗
      polygons: [],
      streetsPointLayer: null, //乡镇图层
      myTitleName: "", //弹窗名称
      myType: "", //点类型
      lastClickedPoint: null, //存储点击的社区、乡镇点、街道
      points: [], //存储区县点位
      myDataList: [],
      srceenSize: [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      ] //屏幕大小
    };
  },
  components: {
    InformationPanel
  },
  beforeMount() {},
  mounted() {
    window.animationFrameID1 = null;
    window.animationFrameID2 = null;
    this.myBussineType = this.$route.name.toLowerCase();
    window.onresize = () => {
      return (() => {
        this.srceenSize.clientWidth = document.documentElement.clientWidth; //窗口宽度
        this. srceenSize.screenHeight = document.documentElement.clientHeight; //窗口高度      
        })();
    };
    this.$nextTick(() => {
      this.initMapTalksMap();
    });
  },
  watch: {
    srceenSize: {
      immediate: true,
      handler: function(newValue) {
        console.log(newValue, "oojojwie");
      }
    }
  },
  methods: {
    initMapTalksMap() {
      var _this = this;
      mapboxgl.accessToken =
        "pk.eyJ1IjoidGFuZ2p1bmNoZW5nIiwiYSI6ImNqa3c5eWR5MjBmNXQzdnBjaWZsbm9kZTAifQ.Qeen8x41i5GTOCjLJVId4Q";
      this.mapboxBaseLayer = new MapboxglLayer("tile", {
        glOptions: {
          style: "mapbox://styles/tangjuncheng/ckhy8om890bfi19qq3mu8qf7e"
        }
      });
      var bound = [115.258112, 30.017277, 116.831081, 29.203385];
      this.maptalksMap = new maptalks.Map("map", {
        center: [115.76036543471832, 29.67568496898585], //[116.404269, 39.914935],
        zoom: 9,
        minZoom: 9,
        maxZoom: 22,
        pitch: 0,
        bearing: 0,
        maxPitch: 60,
        dragPitch:false,
                centerCross: false,
        doubleClickZoom: false,
        baseLayer: this.mapboxBaseLayer
      });

      document.getElementsByClassName("mapboxgl-ctrl-logo")[0].style.display =
        "none";
      document.getElementsByClassName(
        "mapboxgl-ctrl-attrib-inner"
      )[0].style.display = "none";
      document.getElementsByClassName("maptalks-attribution")[0].style.display =
        "none";
      _this.flyToView();

      this.maptalksMap.on("dblclick", function(e) {
        // console.log(
        //   _this.maptalksMap.getCenter(),
        //   _this.maptalksMap.getPitch(),
        //   _this.maptalksMap.getBearing(),
        //   "sdsdsd"
        // );
        var centerPointLayer = _this.maptalksMap.getLayer("centerPointLayer");
        var layers = [];
        if (centerPointLayer !== null) layers.push(centerPointLayer);

        //identify
        _this.maptalksMap.identify(
          {
            coordinate: e.coordinate,
            layers: layers
          },
          function(geos) {
            if (geos.length === 0) {
              _this.isShow = false;
              _this.centerPointLayer.getGeometries().forEach(element => {
                element.updateSymbol({
                  markerFile: require(`../../assets/img/community.png`),
                  markerWidth: 25 / 1.5,
                  markerHeight: 41 / 1.5,
                  textName: "{labelName}", //value from name in geometry's properties
                  textWeight: "normal", //'bold', 'bolder'
                  textStyle: "normal", //'italic', 'oblique'
                  textSize: 14,
                  textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                  textFill: "#FFFFFF",
                  textOpacity: 1,
                  textHaloFill: "#00DDFF",
                  textHaloRadius: 0.1,
                  textWrapWidth: null,
                  textWrapCharacter: "\n",
                  textLineSpacing: 2,
                  textDx: 0,
                  textDy: -40,
                  textHorizontalAlignment: "middle", //left | middle | right | auto
                  textVerticalAlignment: "middle", // top | middle | bottom | auto
                  textAlign: "center" //left | right | center | auto
                });
              });
              return;
            }
          }
        );
      });
      this.maptalksMap.on("mouseout", function(e) {
        /**
         * 移出地图范围，关闭弹窗
         */
        _this.isShow = false;
      });
    },
    initAddLayers() {
      this.addCenterPoints();
    },
    getCurrentDate() {
      var date = new Date();
      var day = date.getDate();
      //如果是每月18日更新数据
      // if (day === "18") {
      //this.updateCenterPoints();
      // }
      //间隔一小时刷新
      setInterval(() => {
        //var date = new Date();
        // var day = date.getDate();
        // if (day === "18") {
        this.updateCenterPoints();
        // }
      }, 7200000);
    },
    /**
     * 更新点位数据
     */
    updateCenterPoints() {
      if (
        this.maptalksMap.getLayer("centerPointLayer") &&
        this.points !== null
      ) {
        this.points.forEach(marker => {
          var value = centerPointData.data.filter(
            item => item.name == marker.properties.name
          )[0].value;

          api.getWholeNetworkJiujiangIndexList({}).then(res => {
            var data = res.records;
            if (data.length > 0) {
              var obj = data.filter(
                item => item.district == marker.properties.name
              )[0];
            }
          });
          marker.properties.labelName =
            marker.properties.name + " " + obj.salesamountRank;
        });
      }
    },
    /**
     * 添加中心点
     */
    addCenterPoints() {
      var _this = this;
      var el;
      var marker;
      if (_this.maptalksMap.getLayer("centerPointLayer")) {
        _this.maptalksMap.removeLayer(
          _this.maptalksMap.getLayer("centerPointLayer")
        );
      }
      this.centerPointLayer = new maptalks.VectorLayer("centerPointLayer", [], {
        enableAltitude: true,
        altitudeProperty: "altitude"
      }).addTo(this.maptalksMap); //centerPointData

      api.getWholeNetworkJiujiangIndexList().then(res => {
        var data = res.records;
        if (data.length > 0) {
          //data.forEach(itemData => {
          if (centerPoint.features.length > 0) {
            centerPoint.features.forEach(feature => {
              if (
                feature.geometry.coordinates[0] !== null &&
                feature.geometry.coordinates[1] !== null
              ) {
                var lnglat = [
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1]
                ];
                var item = data.filter(
                  item => item.district == feature.properties.name
                )[0];
                if (item !== undefined) {
                  var value = item.salesamount;
                  var point = new maptalks.Marker(lnglat, {
                    properties: {
                      altitude: 50,
                      name: feature.properties.name,
                      labelName:
                        feature.properties.name +
                        " " +
                        item.salesamountRank +
                        " " +
                        value +
                        "万元",
                      value: value,
                      wllse: item.salesamount,
                      tb: item.salesamountMom,
                      // swwl: item.salesamountMaterial,
                      // b2cwl: item.salesamountB2c,
                      dpsl: item.salesamountShop,
                      qys: item.salesamountRetailers,
                      type: "other"
                    },
                    symbol: [
                      {
                        markerFile: require(`../../assets/img/community.png`),
                        markerWidth: 25 / 1.5,
                        markerHeight: 41 / 1.5,
                        markerDx: 0,
                        markerDy: 0,
                        markerOpacity: 1
                      },
                      {
                        textName: "{labelName}", //value from name in geometry's properties
                        textWeight: "normal", //'bold', 'bolder'
                        textStyle: "normal", //'italic', 'oblique'
                        textSize: 14,
                        textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                        textFill: "#FFFFFF",
                        textOpacity: 1,
                        textHaloFill: "#00DDFF",
                        textHaloRadius: 0.1,
                        textWrapWidth: null,
                        textWrapCharacter: "\n",
                        textLineSpacing: 0,
                        textDx: 0,
                        textDy: -40,
                        textHorizontalAlignment: "middle", //left | middle | right | auto
                        textVerticalAlignment: "middle", // top | middle | bottom | auto
                        textAlign: "center" //left | right | center | auto
                      }
                    ]
                  })
                    .on("mouseout", function() {
                      _this.isShow = false;

                      if (
                        _this.centerPointLayer != null &&
                        _this.centerPointLayer.getGeometries().length > 0
                      ) {
                        _this.isShow = false;
                        _this.centerPointLayer
                          .getGeometries()
                          .forEach(element => {
                            if (element !== _this.lastClickedPoint) {
                              element.updateSymbol({
                                markerFile: require(`../../assets/img/community.png`),
                                markerWidth: 25 / 1.5,
                                markerHeight: 41 / 1.5,
                                textName: "{labelName}", //value from name in geometry's properties
                                textWeight: "normal", //'bold', 'bolder'
                                textStyle: "normal", //'italic', 'oblique'
                                textSize: 14,
                                textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                                textFill: "#FFFFFF",
                                textOpacity: 1,
                                textHaloFill: "#00DDFF",
                                textHaloRadius: 0.1,
                                textWrapWidth: null,
                                textWrapCharacter: "\n",
                                textLineSpacing: 2,
                                textDx: 0,
                                textDy: -40,
                                textHorizontalAlignment: "middle", //left | middle | right | auto
                                textVerticalAlignment: "middle", // top | middle | bottom | auto
                                textAlign: "center" //left | right | center | auto
                              });
                            } else {
                              element.updateSymbol({
                                markerFile: require(`../../assets/img/community.png`),
                                markerWidth: 25 / 1.5,
                                markerHeight: 41 / 1.5,
                                textName: "{labelName}", //value from name in geometry's properties
                                textWeight: "normal", //'bold', 'bolder'
                                textStyle: "normal", //'italic', 'oblique'
                                textSize: 14,
                                textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                                textFill: "#FFFFFF",
                                textOpacity: 1,
                                textHaloFill: "#00DDFF",
                                textHaloRadius: 0.1,
                                textWrapWidth: null,
                                textWrapCharacter: "\n",
                                textLineSpacing: 2,
                                textDx: 0,
                                textDy: -40,
                                textHorizontalAlignment: "middle", //left | middle | right | auto
                                textVerticalAlignment: "middle", // top | middle | bottom | auto
                                textAlign: "center" //left | right | center | auto
                              });
                            }
                          });
                      }
                    })
                    .on(
                      "mouseenter",
                      debounce(function(e) {
                        _this.centerPointLayer
                          .getGeometries()
                          .forEach(element => {
                            if (element !== e.target) {
                              if (element !== _this.lastClickedPoint) {
                                element.updateSymbol({
                                  markerFile: require(`../../assets/img/community.png`),
                                  markerWidth: 25 / 1.5,
                                  markerHeight: 41 / 1.5,
                                  textName: "{labelName}", //value from name in geometry's properties
                                  textWeight: "normal", //'bold', 'bolder'
                                  textStyle: "normal", //'italic', 'oblique'
                                  textSize: 14,
                                  textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                                  textFill: "#FFFFFF",
                                  textOpacity: 1,
                                  textHaloFill: "#00DDFF",
                                  textHaloRadius: 0.1,
                                  textWrapWidth: null,
                                  textWrapCharacter: "\n",
                                  textLineSpacing: 2,
                                  textDx: 0,
                                  textDy: -40,
                                  textHorizontalAlignment: "middle", //left | middle | right | auto
                                  textVerticalAlignment: "middle", // top | middle | bottom | auto
                                  textAlign: "center" //left | right | center | auto
                                });
                              }
                            } else {
                              e.target.updateSymbol({
                                markerFile: require(`../../assets/img/community.png`),
                                markerWidth: 25,
                                markerHeight: 41,
                                textFaceName: "sans-serif",
                                textName: "{labelName}",
                                textWeight: "normal",
                                textStyle: "normal",
                                textSize: 0,
                                textFont: null,
                                textFill: "#FFFFFF",
                                textOpacity: 1,
                                textHaloFill: "#00DDFF",
                                textHaloRadius: 0.1,
                                textWrapWidth: null,
                                textWrapCharacter: "\n",
                                textLineSpacing: 2,
                                textDx: 0,
                                textDy: -40,
                                textHorizontalAlignment: "middle",
                                textVerticalAlignment: "middle",
                                textAlign: "center"
                              });
                              el = document.getElementById("informationPanel");
                              _this.isShow = true;
                              _this.myTitleName = element.properties.name;
                              _this.myType = element.properties.type;
                              _this.myDataList = [
                                {
                                  fieldName: "网络零售额：",
                                  value: element.properties.wllse,
                                  unit: "万元"
                                },
                                // {
                                //   fieldName: "同比：",
                                //   value: element.properties.tb,
                                //   unit: "%"
                                // },

                                {
                                  fieldName: "店铺数量：",
                                  value: element.properties.dpsl,
                                  unit: "家"
                                },
                                {
                                  fieldName: "企业数：",
                                  value: element.properties.qys,
                                  unit: "家"
                                }
                              ];
                              marker = new maptalks.ui.UIMarker(
                                e.target.getCoordinates(),
                                {
                                  draggable: false,
                                  single: false,
                                  content: el,
                                  dx: -0,
                                  dy: -130
                                }
                              );
                              marker.addTo(_this.maptalksMap).show();

                              _this.lastClickedPoint = e.target;
                            }
                          });
                      }, 200)
                    )
                    .on("click", function(e) {
                      _this.centerPointLayer
                        .getGeometries()
                        .forEach(element => {
                          if (element !== e.target) {
                            element.updateSymbol({
                              markerFile: require(`../../assets/img/community.png`),
                              markerWidth: 25 / 2,
                              markerHeight: 41 / 2
                            });
                          } else {
                            _this.maptalksMap.animateTo(
                              {
                                center: [
                                  e.target.getCoordinates().x,
                                  e.target.getCoordinates().y + 0.02
                                ],
                                zoom: 13,
                                pitch: 60,
                                bearing: 0
                              },
                              {
                                duration: 500
                              }
                            );

                            _this.lastClickedPoint = e.target;
                          }
                        });
                    });

                  _this.points.push(point);
                  point.properties.labelName =
                    feature.properties.name + " " + item.salesamountRank;
                }
              }
            });
            this.centerPointLayer.addGeometry(_this.points);
            _this.getCurrentDate();
          }
          // });
        }
      });

      this.centerPointLayer.setZIndex(999);
    },
    flyToTargetFeature(queryString) {
      // this.streetsPointLayer.getGeometries().forEach((element) => {
      //   if (element.properties.name === queryString) {
      //     this.maptalksMap.animateTo(
      //       {
      //         center: element.getCoordinates(),
      //         zoom: 15.5,
      //         pitch: 60,
      //         bearing: 0,
      //       },
      //       {
      //         duration: 2000,
      //       }
      //     );
      //     element.updateSymbol({
      //       markerFile: require(`../../assets/img/streets.png`),
      //       markerWidth: 25,
      //       markerHeight: 41,
      //       textDx: 0,
      //       textDy: -80,
      //       textFaceName: "sans-serif",
      //       textName: "{name}", //value from name in geometry's properties
      //       textWeight: "normal", //'bold', 'bolder'
      //       textStyle: "normal", //'italic', 'oblique'
      //       textSize: 14,
      //       textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
      //       textFill: "#fff",
      //       textOpacity: 1,
      //       textHaloFill: "#fff",
      //       textHaloRadius: 0,
      //       textWrapWidth: null,
      //       textWrapCharacter: "\n",
      //       textLineSpacing: 0,
      //       textHorizontalAlignment: "middle", //left | middle | right | auto
      //       textVerticalAlignment: "middle", // top | middle | bottom | auto
      //       textAlign: "center", //left | right | center | auto
      //     });
      //   } else {
      //     element.updateSymbol({
      //       markerFile: require(`../../assets/img/streets.png`),
      //       markerWidth: 25 / 2,
      //       markerHeight: 41 / 2,
      //       textSize: 0,
      //     });
      //   }
      // });
    },
    drawPolygons(idx, coordinates, properties) {
      const polygon = new maptalks.MultiPolygon(coordinates, {
        cursor: null,
        shadowBlur: 0,
        shadowColor: "black",
        symbol: {
          lineWidth: 1,
          lineColor: edgeColor,
          lineDasharray: [0.2, 5], //线形
          polygonFill: polygonColors[0],
          polygonOpacity: 0.5
        },
        properties: {
          id: properties.id,
          index: idx,
          properties: properties
        }
      })
        .on("mouseenter", function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[1]
          });
          // var el = document.getElementById('information_panel')
          //  var marker = new maptalks.ui.UIMarker([116.404269, 39.914935], {
          //   'draggable': false,
          //   'single': false,
          //   'content': el
          // });
          // marker.addTo(this.maptalksMap).show();
        })
        .on("mouseout", function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[0]
          });
        });
      this.polygons.push(polygon);
    },
    drawRegion(layerId) {
      const features = bound.features;
      features.forEach((g, i) => {
        const properties = g.properties;
        const coordinates = g.geometry.coordinates;
        this.drawPolygons(i, coordinates, properties);
      });
      this.polygonsLayer = new maptalks.VectorLayer(layerId, this.polygons, {
        enableAltitude: true
      }).addTo(this.maptalksMap);
    },
    async addRoadThreeLayer() {
      var _this = this;
      var threeLayer = new ThreeLayer("threeLayerRoad", {
        forceRenderOnMoving: false,
        forceRenderOnRotating: false,
        minZoom: 5,
        maxZoom: 22
        // animation: true
      });
      threeLayer.addTo(_this.maptalksMap);
      threeLayer.prepareToDraw = function(gl, scene, camera) {
        // var light = new THREE.DirectionalLight("rgb(60,60,188)");
        // light.position.set(0, -10, 10).normalize();
        // scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI));
        _this.showLine = _this.$route.query.isShow;
        if (_this.showLine === "1" && _this.showLine != undefined) {
          //材质必须放在static目录中
        }
        var roadSprite = require(`../../assets/img/roadSprite.png`);
        addSpriteLinesLayer(roadSprite);
        animation();
      };
      var meshesRoads = [];
      async function addSpriteLinesLayer(textureURL) {
        var geojson = roads; // JSON.parse(geojson);
        let texture = new THREE.TextureLoader().load(textureURL);
        texture.anisotropy = 16;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        let camera = threeLayer.getCamera();
        let material = new MeshLineMaterial({
          map: texture,
          useMap: true,
          lineWidth: 8,
          sizeAttenuation: false,
          transparent: true,
          near: camera.near,
          far: camera.far
        });
        let multiLineStrings = maptalks.GeoJSON.toGeometry(geojson);
        for (let multiLineString of multiLineStrings) {
          let lines = multiLineString._geometries.map(lineString => {
            if (lineLength(lineString) > 100) {
              return new SpriteLine(
                lineString,
                { altitude: 0, speed: 0.0003 },
                material,
                threeLayer
              );
            } else {
              return null;
            }
          });
          if (lines != null) {
            threeLayer.addMesh(lines);
            meshesRoads = meshesRoads.concat(lines);
          }
        }
      }
      function animation() {
        // layer animation support Skipping frames
        threeLayer._needsUpdate = !threeLayer._needsUpdate;
        if (threeLayer._needsUpdate) {
          threeLayer.renderScene();
        }
        //stats.update();
        window.animationFrameID1 = requestAnimationFrame(animation);
      }
    },
    async addThreeLayer() {
      var _this = this;
      var threeLayer = new ThreeLayer("threeLayer", {
        forceRenderOnMoving: false,
        forceRenderOnRotating: false
        // animation: true
      });
      threeLayer.addTo(_this.maptalksMap);
      threeLayer.prepareToDraw = function(gl, scene, camera) {
        var light = new THREE.DirectionalLight("rgb(60,60,188)");
        light.position.set(0, -10, 10).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI));

        setTimeout(() => {
          addWater();
        }, 1000);
        setTimeout(() => {
          addRippleWall();
          //addGltfRotate();
          // addEffectLayer(_this.maptalksMap,[
          //   [113.9881564, 30.199253100000104],
          //   [113.9881564, 30.191253100000104]
          // ]);
        }, 2000);
        // addRingEffect([113.9881564, 30.199253100000104])
        //addElectricShield([114.043, 30.296])
        animation();
      };
      var waters;
      function addWater() {
        // fetch("./data/westlake.json")
        //   .then(function(res) {
        //     return res.text();
        //   })
        //   .then(function(geojson) {
        var polygons = maptalks.GeoJSON.toGeometry(waterJson);
        waters = polygons.map(p => new CoolWater(p, {}, threeLayer));

        threeLayer.addMesh(waters);

        //threeLayer.config("animation", true);
        animation();
        // });
      }
      // var oceans;
      // async function addWater() {
      //   var polygons = maptalks.GeoJSON.toGeometry(waterJson);
      //   oceans = polygons.map(p => {
      //     var ocean = new Water(
      //       p,
      //       {
      //         waterColor: "#00A8CE",
      //         // altitude: 2,
      //         waterNormals: require(`./feature/img/CoolWater-iChannel1.jpg`)
      //       },
      //       threeLayer
      //     );
      //     return ocean;
      //   });

      //   threeLayer.addMesh(oceans);
      //   animation();
      // }
      var groundWall, material;

      function addRippleWall() {
        var boundMax = require(`./data/jiujiang_bound_max.json`);
        let multiLineStrings = maptalks.GeoJSON.toGeometry(boundMax);
        var item;
        var itemList = [];
        multiLineStrings.map(p => {
          item = p.getGeometries()[0].getCoordinates();
          item.map(n => {
            n.map(m => {
              itemList.push([m.x, m.y]);
            });
          });
        });
        material = getWallMaterial();
        material.uniforms.color.value.setStyle("#34C5DC");
        material.uniforms.opacity.value = 1;

        groundWall = new RippleWall(
          [itemList][0],
          { height: 8000, speed: 0.025 },
          material,
          threeLayer
        );
        threeLayer.addMesh(groundWall);

        setInterval(() => {
          groundWall.animateShow({
            duration: 3000
          });
        }, 5000);
        //animation();
      }
      function getWallMaterial() {
        const vertexs = {
          normal_vertex: "\n  precision lowp float;\n  precision lowp int;\n  "
            .concat(
              THREE.ShaderChunk.fog_pars_vertex,
              "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
            )
            .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n")
        };

        const fragments = {
          rippleWall_fragment:
            "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  uniform float num;\n  uniform float hiz;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec4 fragColor = vec4(0.);\n    float sin = sin((vUv.y - time * hiz) * 10. * num);\n    float high = 0.92;\n    float medium = 0.4;\n    if (sin > high) {\n      fragColor = vec4(mix(vec3(.8, 1., 1.), color, (1. - sin) / (1. - high)), 1.);\n    } else if(sin > medium) {\n      fragColor = vec4(color, mix(1., 0., 1.-(sin - medium) / (high - medium)));\n    } else {\n      fragColor = vec4(color, 0.);\n    }\n\n    vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);\n    fragColor = mix(fragColor, vec4(fade, 1.), 0.85);\n    gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));\n  }\n"
        };
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: {
              type: "pv2",
              value: 0
            },
            color: {
              type: "uvs",
              value: new THREE.Color("#0099FF")
            },
            opacity: {
              type: "pv2",
              value: 1
            },
            num: {
              type: "pv2",
              value: 5
            },
            hiz: {
              type: "pv2",
              value: 0.15
            }
          },
          vertexShader: vertexs.normal_vertex,
          fragmentShader: fragments.rippleWall_fragment,
          blending: THREE.AdditiveBlending,
          transparent: !0,
          depthWrite: !1,
          depthTest: !0,
          side: THREE.DoubleSide
        });
        return material;
      }

      // var idxc = -1;
      // /**
      //  * 添加UV动画
      //  */
      // async function addEffectLayer(maptalks,lnglatList) {
      //   var _this = this;
      //   var effectlayer;
      //   if (!maptalks.getLayer("effectlayer")) {
      //     effectlayer = new EffectLayer("effectlayer").addTo(maptalks);
      //   }
      //   var image = new Image();
      //   image.src = require(`../../assets/img/guangshu.png`);
      //   image.onload = function() {
      //     var texture = new reshader.Texture2D({
      //       data: image,
      //       mag: "linear"
      //     });
      //     lnglatList.forEach(lnglat => {
      //       console.log(lnglat, "lnglatlnglatlnglat");
      //       new EffectMarker(lnglat, {
      //         symbol: {
      //           animation: true,
      //           loop: true,
      //           effect: "uv",
      //           url: (`./data/RobotExpressive.glb`),
      //           speed: 0.05,
      //           rotation: [90, 0, 90],
      //           translation: [0, 0, 0],
      //           transparent: true,
      //           scale: [0.2, 0.5, 0.2],
      //           uniforms: {
      //             texture: texture,
      //             width: 1,
      //             height: 1
      //           }
      //         }
      //       }).addTo(effectlayer);
      //     });
      //   };
      // }
      // function getMaterial() {
      //   var ElectricShield = {
      //     uniforms: {
      //       time: {
      //         type: 'f',
      //         value: 0,
      //       },
      //       color: {
      //         type: 'c',
      //         value: new THREE.Color('yellow'),
      //       },
      //       opacity: {
      //         type: 'f',
      //         value: 1,
      //       },
      //     },
      //     vertexShaderSource: '\n  precision lowp float;\n  precision lowp int;\n  '
      //       .concat(
      //         THREE.ShaderChunk.fog_pars_vertex,
      //         '\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    '
      //       )
      //       .concat(THREE.ShaderChunk.fog_vertex, '\n  }\n'),
      //     fragmentShaderSource: `
      //           #if __VERSION__ == 100
      //            #extension GL_OES_standard_derivatives : enable
      //           #endif
      //           uniform vec3 color;
      //           uniform float opacity;
      //           uniform float time;
      //           varying vec2 vUv;
      //           #define pi 3.1415926535
      //           #define PI2RAD 0.01745329252
      //           #define TWO_PI (2. * PI)
      //           float rands(float p){
      //               return fract(sin(p) * 10000.0);
      //           }
      //           float noise(vec2 p){
      //               float t = time / 20000.0;
      //               if(t > 1.0) t -= floor(t);
      //               return rands(p.x * 14. + p.y * sin(t) * 0.5);
      //           }
      //           vec2 sw(vec2 p){
      //               return vec2(floor(p.x), floor(p.y));
      //           }
      //           vec2 se(vec2 p){
      //               return vec2(ceil(p.x), floor(p.y));
      //           }
      //           vec2 nw(vec2 p){
      //               return vec2(floor(p.x), ceil(p.y));
      //           }
      //           vec2 ne(vec2 p){
      //               return vec2(ceil(p.x), ceil(p.y));
      //           }
      //           float smoothNoise(vec2 p){
      //               vec2 inter = smoothstep(0.0, 1.0, fract(p));
      //               float s = mix(noise(sw(p)), noise(se(p)), inter.x);
      //               float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
      //               return mix(s, n, inter.y);
      //           }
      //           float fbm(vec2 p){
      //               float z = 2.0;
      //               float rz = 0.0;
      //               vec2 bp = p;
      //               for(float i = 1.0; i < 6.0; i++){
      //               rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
      //               z *= 2.0;
      //               p *= 2.0;
      //               }
      //               return rz;
      //           }
      //           void main() {
      //               vec2 uv = vUv;
      //               vec2 uv2 = vUv;
      //               if (uv.y < 0.5) {
      //               discard;
      //               }
      //               uv *= 4.;
      //               float rz = fbm(uv);
      //               uv /= exp(mod(time * 2.0, pi));
      //               rz *= pow(15., 0.9);
      //               gl_FragColor = mix(vec4(color, opacity) / rz, vec4(color, 0.1), 0.2);
      //               if (uv2.x < 0.05) {
      //               gl_FragColor = mix(vec4(color, 0.1), gl_FragColor, uv2.x / 0.05);
      //               }
      //               if (uv2.x > 0.95){
      //               gl_FragColor = mix(gl_FragColor, vec4(color, 0.1), (uv2.x - 0.95) / 0.05);
      //               }
      //           }`,
      //   }
      //   let material = new THREE.ShaderMaterial({
      //     uniforms: ElectricShield.uniforms,
      //     defaultAttributeValues: {},
      //     vertexShader: ElectricShield.vertexShaderSource,
      //     fragmentShader: ElectricShield.fragmentShaderSource,
      //     blending: THREE.AdditiveBlending,
      //     depthWrite: !1,
      //     depthTest: !0,
      //     side: THREE.DoubleSide,
      //     transparent: !0,
      //   })
      //   return material
      // }
      // var ballElectric, materialElectric
      // async function addElectricShield(lnglat) {
      //   materialElectric = getMaterial()
      //   ballElectric = new ElectricShield(
      //     lnglat,
      //     { radius: 500 },
      //     materialElectric,
      //     threeLayer
      //   )
      //   threeLayer.addMesh(ballElectric)

      //   // animation();
      // }
      /**
       * 添加发光环
       */
      // async function addRingEffect(position) {
      //   var material = getMaterial(0)
      //   var ringObj = new RingEffect(
      //     position,
      //     {
      //       radius: 1000,
      //       speed: 0.001,
      //     },
      //     material,
      //     threeLayer
      //   )
      //   threeLayer.addMesh(ringObj)
      //   function getMaterial(type = 0) {
      //     var ringShield = {
      //       uniforms: {
      //         color: {
      //           type: 'c',
      //           value: new THREE.Color('#9999FF'),
      //         },
      //         time: {
      //           type: 'f',
      //           value: -1.5,
      //         },
      //         type: {
      //           type: 'f',
      //           value: type || 0,
      //         },
      //         num: {
      //           type: 'f',
      //           value: 4,
      //         },
      //       },
      //       vertexShaderSource: `
      //               varying vec2 vUv;
      //               void main(){
      //                       vUv = uv;
      //                       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      //               }`,
      //       fragmentShaderSource: `
      //               uniform float time;
      //               uniform vec3 color;
      //               uniform float type;
      //               uniform float num;
      //               varying vec2 vUv;
      //               void main(){
      //                   float alpha = 1.0;
      //                   float dis = distance(vUv,vec2(0.5));//0-0.5
      //                   if(dis > 0.5){
      //                       discard;
      //                   }
      //                   if(type ==0.0){
      //                           float y = (sin(6.0 * num *(dis-time)) + 1.0)/2.0;
      //                       alpha = smoothstep(1.0,0.0,abs(y-0.5)/0.5) * (0.5 -dis) * 2.;
      //                   }else if(type ==1.0){
      //                           float step = fract(time* 4.)* 0.5;
      //                       if(dis<step){
      //                               // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
      //                           alpha =1.- abs(step-dis)/0.15;
      //                       }else{
      //                               alpha = smoothstep(1.0,0.0,abs(step-dis)/0.05);
      //                       }
      //                       alpha *= (pow((0.5 -dis)* 3.0,2.0));
      //                   }
      //                   gl_FragColor = vec4(color,alpha );
      //               }`,
      //     }
      //     let material = new THREE.ShaderMaterial({
      //       uniforms: ringShield.uniforms,
      //       defaultAttributeValues: {},
      //       vertexShader: ringShield.vertexShaderSource,
      //       fragmentShader: ringShield.fragmentShaderSource,
      //       blending: THREE.AdditiveBlending,
      //       depthWrite: !1,
      //       depthTest: !0,
      //       side: THREE.DoubleSide,
      //       transparent: !0,
      //       fog: !0,
      //     })
      //     return material
      //   }
      // }
      function animation() {
        // layer animation support Skipping frames
        threeLayer._needsUpdate = !threeLayer._needsUpdate;
        if (threeLayer._needsUpdate) {
          threeLayer.renderScene();
        }
        //stats.update();
        window.animationFrameID2 = requestAnimationFrame(animation);
      }
    },
    // async addBloomThreeLayer() {
    //   // the ThreeLayer to draw buildings
    //   var _this = this;
    //   var threeLayer = new ThreeLayer("BloomLayer", {
    //     forceRenderOnMoving: false,
    //     forceRenderOnRotating: false,
    //     // animation: true
    //   });
    //   threeLayer.addTo(_this.maptalksMap);

    //   threeLayer.prepareToDraw = function(gl, scene, camera) {
    //     var light = new THREE.DirectionalLight("rgb(60,60,188)");
    //     light.position.set(0, -10, 10).normalize();
    //     scene.add(light);
    //     camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI));
    //     this.initBloom();
    //     this.setRendererRenderScene();
    //     addLines();
    //   };
    //   /**
    //    * initBloom
    //    * */
    //   ThreeLayer.prototype.initBloom = function() {
    //     const params = {
    //       exposure: 1,
    //       bloomStrength: 2.4,
    //       bloomThreshold: -2,
    //       bloomRadius: 0,
    //       debug: false,
    //     };
    //     const renderer = this.getThreeRenderer();
    //     renderer.setAlpha = true;

    //     const size = this.getMap().getSize();
    //     this.composer = new EffectComposer(renderer);
    //     this.composer.setSize(size.width, size.height);

    //     const scene = this.getScene(),
    //       camera = this.getCamera();
    //     this.renderPass = new RenderPass(scene, camera);

    //     this.composer.addPass(this.renderPass);

    //     const bloomPass = (this.bloomPass = new UnrealBloomPass(
    //       new THREE.Vector2(size.width, size.height)
    //     ));
    //     bloomPass.renderToScreen = true;
    //     bloomPass.threshold = params.bloomThreshold;
    //     bloomPass.strength = params.bloomStrength;
    //     bloomPass.radius = params.bloomRadius;

    //     this.composer.addPass(bloomPass);
    //     this.bloomEnable = true;
    //   };

    //   /*
    //        @override  renderer.renderScene

    //     */

    //   ThreeLayer.prototype.setRendererRenderScene = function() {
    //     this.getRenderer().renderScene = function() {
    //       const layer = this.layer;
    //       layer._callbackBaseObjectAnimation();
    //       this._syncCamera();

    //       const renderer = this.context,
    //         camera = this.camera,
    //         scene = this.scene;
    //       if (
    //         layer.bloomEnable &&
    //         layer.composer &&
    //         layer.composer.passes.length > 1
    //       ) {
    //         if (renderer.autoClear) {
    //           renderer.autoClear = false;
    //         }
    //         if (layer.bloomPass) {
    //           camera.layers.set(1);
    //         }
    //         if (layer && layer.composer) {
    //           layer.composer.render(0);
    //         }
    //         renderer.clearDepth();
    //         camera.layers.set(0);
    //         renderer.render(scene, camera);
    //       } else {
    //         if (!renderer.autoClear) {
    //           renderer.autoClear = true;
    //         }
    //         renderer.render(scene, camera);
    //       }

    //       this.completeRender();
    //     };
    //   };

    //   var baseLineMaterial = new THREE.LineBasicMaterial({
    //     linewidth: 1,
    //     color: "rgb(255,90,0)",
    //     opacity: 0.5,
    //     blending: THREE.AdditiveBlending,
    //     transparent: true,
    //   });
    //   var baseLines = [];

    //   function addLines() {
    //     var geojson = roads; // JSON.parse(geojson);
    //     var lineStrings = maptalks.GeoJSON.toGeometry(geojson);

    //     var data = [],
    //       data1 = [];
    //     //var classMap = {};
    //     lineStrings.forEach((lineString) => {
    //       console.log(lineString.getGeometries()[0],'lineStringlineStringlineString')
    //       // const fclass = lineString.getProperties().fclass;
    //       // classMap[fclass] = fclass;
    //       // //main road
    //       // if (
    //       //   fclass &&
    //       //   (fclass.includes("primary") ||
    //       //     fclass.includes("secondary") ||
    //       //     fclass.includes("tertiary"))
    //       // ) {
    //       //   data1.push(lineString);
    //       // } else {
    //       //   data.push(lineString);
    //       // }
    //       data1.push(lineString.getGeometries()[0]);
    //     });
    //     const list = [];
    //     data.forEach((lineString) => {
    //       list.push({
    //         lineString,
    //         len: lineLength(lineString),
    //       });
    //     });
    //     data = list.sort(function(a, b) {
    //       return b.len - a.len;
    //     });

    //     baseLines = data.slice(0, 200).map(function(d) {
    //       var line = threeLayer.toLine(d.lineString, {}, baseLineMaterial);
    //       line.getObject3d().layers.enable(1);
    //       return line;
    //     });
    //     threeLayer.addMesh(baseLines);

    //     addExtrudeLine(data1);
    //   }

    //   var material = new THREE.MeshBasicMaterial({
    //     color: "rgb(255,45,0)",
    //     transparent: true,
    //     blending: THREE.AdditiveBlending,
    //   });
    //   var highlightmaterial = new THREE.MeshBasicMaterial({
    //     color: "#ffffff",
    //     transparent: true,
    //   });
    //   var lines, lineTrails;

    //   function addExtrudeLine(lineStrings) {
    //     var timer = "generate line time";
    //     console.time(timer);
    //     const list = [];
    //     lineStrings.forEach((lineString) => {
    //       list.push({
    //         lineString,
    //         len: lineLength(lineString),
    //       });
    //     });
    //     lineStrings = list.sort(function(a, b) {
    //       return b.len - a.len;
    //     });

    //     lines = lineStrings.slice(0, 1000).map((d) => {
    //       var line = threeLayer.toExtrudeLine(
    //         d.lineString,
    //         { altitude: 0, width: 2, height: 1 },
    //         material
    //       );
    //       line.getObject3d().layers.enable(1);
    //       return line;
    //     });
    //     lineTrails = lineStrings.slice(0, 300).map(function(d) {
    //       var line = threeLayer.toExtrudeLineTrail(
    //         d.lineString,
    //         {
    //           altitude: 0,
    //           width: 2,
    //           height: 2,
    //           chunkLength: d.len / 40,
    //           speed: 1,
    //           trail: 6,
    //         },
    //         highlightmaterial
    //       );
    //       line.getObject3d().layers.enable(1);
    //       return line;
    //     });

    //     threeLayer.addMesh(lines);
    //     threeLayer.addMesh(lineTrails);
    //     //initGui();
    //     threeLayer.config("animation", true);
    //     animation();
    //   }

    //   function animation() {
    //     // layer animation support Skipping frames
    //     threeLayer._needsUpdate = !threeLayer._needsUpdate;
    //     if (threeLayer._needsUpdate) {
    //       threeLayer.renderScene();
    //     }
    //     //stats.update();
    //     requestAnimationFrame(animation);
    //   }
    // },
    async flyToView() {
       var _this = this;
      _this.maptalksMap.animateTo(
        {
          center: [115.45122123721512, 29.18912726720785],
          zoom: 8.5,
          pitch: 0,
          bearing: 0
        },
        {
          duration: 2000
        }
      );
      setTimeout(() => {
        _this.maptalksMap.animateTo(
          {
            center: [115.32929276222058, 29.178697767437],
            zoom: 9,
            pitch: 60,
            bearing: 32
          },
          {
            duration: 4000
          }
        );
      }, 2000);
      var extent = _this.maptalksMap.getExtent();
      _this.maptalksMap.setMaxExtent(extent);
      setTimeout(() => {
        _this.initAddLayers();
      }, 1000);
      setTimeout(() => {
        _this.addThreeLayer();
        _this.addRoadThreeLayer();

        // _this.addBloomThreeLayer();
      }, 5000);

      _this.rotateMap();
    },
    /**
     * [description] 旋转地图
     * @return {[type]} [description]
     */
    async rotateMap() {
      this.rotateObj = new Rotate(this.maptalksMap, {
        speed: 0.05,
        time: -1,
        mouseControl: true
      });
    }
  },
  destroyed() {
    if (window.animationFrameID1 !== null) {
      cancelAnimationFrame(window.animationFrameID1);
    }
    if (window.animationFrameID2 !== null) {
      cancelAnimationFrame(window.animationFrameID2);
    }
  }
};
</script>
<style lang="less" scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
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
  background-image: url("../../assets/img/map-mask.png");
  background-size: 100% 100%;
}
</style>
