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
import { debounce } from "loadsh";
import { MeshLineMaterial } from "./js/THREE.MeshLine";
import SpriteLine from "./feature/SpriteLine";
import RippleWall from "./feature/RippleWall";
import { lineLength } from "./js/geoutil";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
import { ThreeLayer } from "maptalks.three/dist/maptalks.three.js"; //必须按这种方式import
import Rotate from "./js/rotate";
import mapboxgl from "mapbox-gl";

import { MapboxglLayer } from "maptalks.mapboxgl";
import roads from "./data/roads.json";
import InformationPanel from "./Panel/InformationPanel";
import { obtainZone } from "@/utils/pointiInZone";
import { wgs84togcj02, wgs84toepsg3857 } from "@/utils/map";

export default {
  name: "MainMap",
  props: ["mapCenter"],
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
      lines: [],
      myDataList: [],
      zoneList: [],
      srceenSize: [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
      ], //屏幕大小
      MapCenter: null,
      optionSelectAlarmType: [],
    };
  },
  components: {
    InformationPanel,
  },
  beforeMount() {},
  mounted() {
    window.animationFrameID1 = null;
    window.animationFrameID2 = null;
    this.myBussineType = this.$route.name.toLowerCase();
    window.onresize = () => {
      return (() => {
        this.srceenSize.clientWidth = document.documentElement.clientWidth; //窗口宽度
        this.srceenSize.screenHeight = document.documentElement.clientHeight; //窗口高度
      })();
    };
    this.setOptionAlarms();
    this.$nextTick(() => {
      this.initMapTalksMap();
    });
  },
  watch: {
    mapCenter(data) {
      if (!data) return;
      console.log("!!!!!!!!!!!", data);
      let center = data.split("|");
      if (this.maptalksMap) {
        this.MapCenter = wgs84togcj02(center);
        // console.log(' this.MapCenter', this.MapCenter);
        this.maptalksMap.animateTo(
          {
            // center: [87.617733, 43.792818],
            center: this.MapCenter,
            zoom: 13,
            pitch: 60,
            bearing: 32,
          },
          {
            duration: 2000,
          }
        );
      }
    },
    srceenSize: {
      immediate: true,
      handler: function (newValue) {
        console.log(newValue, "oojojwie");
      },
    },
  },
  methods: {
    handelgive(data = {}) {
      let arr = obtainZone(data, this.zoneList);
      arr.forEach((i) => {
        this.getliner(i.id, data);
      });
    },
    initMapTalksMap() {
      var _this = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoiemhhb2xpeHVhbiIsImEiOiJja2V2ODQ1djAyNHY3MnhxdmZ5YTY3YWEzIn0.CItJzP4ZEAoBd0Pv8SUUGg";
      this.mapboxBaseLayer = new MapboxglLayer("tile", {
        glOptions: {
          style: "mapbox://styles/zhaolixuan/clj0s1h4b00gp01pw7jg20h5i",
        },
      });
      // console.log(wgs84toepsg3857([116.38821589024599, 39.97533303800978]));
      this.maptalksMap = new maptalks.Map("map", {
        // center: [87.617733, 43.792818], //[116.404269, 39.914935],
        center:
          this.MapCenter ||
          wgs84togcj02([116.38821589024599, 39.97533303800978]),
        zoom: 5,
        minZoom: 6,
        maxZoom: 22,
        pitch: 0,
        bearing: 0,
        maxPitch: 60,
        dragPitch: true,
        centerCross: false,
        doubleClickZoom: false,
        baseLayer: this.mapboxBaseLayer,
        // baseLayer: new maptalks.TileLayer("tile", {
        //   urlTemplate:
        //     "http://mt2.google.cn/vt?lyrs=m@180000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=Gal",
        // }),
        // baseLayer: new maptalks.TileLayer("tile", {
        //   crossOrigin: "Anonymous",
        //   urlTemplate:
        //     "http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=mytk",
        //   subdomains: [1, 2, 3, 4],
        // }),
      });
      // const projection = this.maptalksMap.getProjection();
      // console.log(maptalks);
      // if (projection instanceof maptalks.Projection.EPSG3857) {
      //   console.log("地图使用的是Web墨卡托投影");
      // } else if (projection instanceof maptalks.Projection.EPSG4326) {
      //   console.log("地图使用的是经纬度投影");
      // } else {
      //   console.log("地图使用的是其他自定义投影方式");
      // }

      window.maptalksMap = this.maptalksMap;
      document.getElementsByClassName("mapboxgl-ctrl-logo")[0].style.display =
        "none";
      document.getElementsByClassName(
        "mapboxgl-ctrl-attrib-inner"
      )[0].style.display = "none";
      document.getElementsByClassName("maptalks-attribution")[0].style.display =
        "none";
      _this.flyToView();

      this.maptalksMap.on("dblclick", function (e) {
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
            layers: layers,
          },
          function (geos) {
            if (geos.length === 0) {
              console.log("初始化");
              _this.isShow = false;
              _this.centerPointLayer.getGeometries().forEach((element) => {
                element.updateSymbol({
                  markerFile: require(`../../assets/image/community.png`),
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
                  textAlign: "center", //left | right | center | auto
                });
              });
              return;
            }
          }
        );
      });
      this.maptalksMap.on("mouseout", function (e) {
        /**
         * 移出地图范围，关闭弹窗
         */
        // console.log("移出地图范围，关闭弹窗");
        _this.isShow = false;
      });
      this.maptalksMap.on("click", function (e) {
        console.log(e);
      });
    },
    initAddLayers() {
      this.addCenterPoints();
      this.addLiners();
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
      this.centerPointLayer = new maptalks.VectorLayer(
        "centerPointLayer"
      ).addTo(this.maptalksMap); //centerPointData

      // api.hostManageList().then(res => {
      //   this.addMaker(res.rows)
      // })

      api.aideDeviceList().then((res) => {
        this.addMaker(res.rows, "waishe");
      });

      api.hostManageList().then((res) => {
        this.addMaker(res.rows, "zhuji");
      });
    },
    addMaker(data, type) {
      var _this = this;
      var el;
      var marker;
      if (data.length > 0) {
        data.forEach((item, index) => {
          if (item !== undefined) {
            var lnglat;
            if (type == "zhuji") {
              lnglat = item.latiscope && item.latiscope.split("|");
            } else if (type == "waishe") {
              lnglat = item.latitude && item.latitude.split("|");
            }
            if (!lnglat) return;
            // if (index == 0) {
            //   lnglat = [116.38821589024599, 39.97533303800978]
            // } else if (index == 2) {
            //   lnglat = [116.38966024924933, 39.982365972768]
            // } else {
            //   lnglat = [116.38778960137059, 39.978345549062944]
            // }
            // console.log(lnglat, wgs84togcj02(lnglat));
            var point = new maptalks.Marker(wgs84togcj02(lnglat), {
              id: item.aideDeviceId,
              properties: {
                altitude: 50,
                name: item.hostName,
                labelName: item.hostName,
                region: item.region || "",
                hostId: item.hostId || "",
                channelName: item.channelName || "",
                channelZoneName: item.channelZoneName || "0",
                // swwl: item.salesamountMaterial,
                // b2cwl: item.salesamountB2c,
                ip: item.ip || "",
                type: "other",
              },
              symbol: [
                {
                  markerFile: require(`../../assets/image/${type}.png`),
                  markerWidth: 20 / 1.5,
                  markerHeight: 30 / 1.5,
                  markerDx: 0,
                  markerDy: 0,
                  markerOpacity: 1,
                },
              ],
            })
              .on("mouseout", function () {
                console.log("mack移除");
                _this.isShow = false;
              })
              .on(
                "mouseenter",
                debounce(function (e) {
                  _this.centerPointLayer.getGeometries().forEach((element) => {
                    if (element == e.target) {
                      // console.log(element);
                      el = document.getElementById("informationPanel");
                      _this.isShow = true;
                      _this.myTitleName = element.properties.name;
                      _this.myType = element.properties.type;
                      if (type == "zhuji") {
                        _this.myDataList = [
                          {
                            fieldName: "主机ID",
                            value: element.properties.hostId,
                          },
                          {
                            fieldName: "所属地区",
                            value: element.properties.region,
                          },
                        ];
                      } else {
                        _this.myDataList = [
                          {
                            fieldName: "所属通道",
                            value: element.properties.channelName,
                          },
                          {
                            fieldName: "所属分区",
                            value: element.properties.channelZoneName,
                          },
                          {
                            fieldName: "ip地址",
                            value: element.properties.ip,
                          },
                        ];
                      }

                      marker = new maptalks.ui.UIMarker(
                        e.target.getCoordinates(),
                        {
                          draggable: false,
                          single: false,
                          content: el,
                          dx: -0,
                          dy: -100,
                        }
                      );
                      marker.addTo(_this.maptalksMap).show();

                      _this.lastClickedPoint = e.target;
                    }
                  });
                }, 200)
              )
              .on("click", function (e) {
                _this.centerPointLayer.getGeometries().forEach((element) => {
                  if (element !== e.target) {
                    element.updateSymbol({
                      markerFile: require(`../../assets/image/zhuji.png`),
                      markerWidth: 25 / 2,
                      markerHeight: 41 / 2,
                    });
                  } else {
                    _this.maptalksMap.animateTo(
                      {
                        center: [
                          e.target.getCoordinates().x,
                          e.target.getCoordinates().y + 0.02,
                        ],
                        zoom: 13,
                        pitch: 60,
                        bearing: 0,
                      },
                      {
                        duration: 500,
                      }
                    );

                    _this.lastClickedPoint = e.target;
                  }
                });
              });

            _this.points.push(point);
            point.properties.labelName =
              item.district + " " + item.salesamountRank;
          }
        });

        this.centerPointLayer.addGeometry(_this.points);
        this.centerPointLayer.setZIndex(999);
        // const targetPoint = this.centerPointLayer.getGeometryById('markeId');
      }
    },

    addLiners() {
      this.centerLinesLayer = new maptalks.VectorLayer("vector", []).addTo(
        this.maptalksMap
      ); //centerPointData

      var _this = this;
      var el, marker;
      api.zoneList().then((res) => {
        if (!res.rows.length) return;
        this.zoneList = res.rows;
        res.rows.forEach((item) => {
          if (item.latscope) {
            var reg = new RegExp("\n", "g");
            let resData = item.latscope.replace(reg, "").split(",");
            let pointData = [];
            resData.forEach((j) => {
              let resData_item = wgs84togcj02(j.split("|"));
              if (resData_item.length) {
                pointData.push([resData_item[0] * 1, resData_item[1] * 1]);
              }
            });
            let line = new maptalks.LineString(pointData, {
              id: item.channelZoneId,
              properties: {
                name: item.channelZoneName,
                channelStartNum: item.channelStartNum,
                channelName: item.channelName,
                channelEndNum: item.channelEndNum,
                pointDataStart: pointData[0],
                pointDataEnd: pointData[pointData.length - 1],
              },
              visible: true,
              editable: false,
              cursor: null,
              draggable: false,
              dragShadow: false, // display a shadow during dragging
              drawOnAxis: null, // force dragging stick on a axis, can be: x, y
              symbol: {
                lineColor: "#1bbc9b",
                lineWidth: 3,
              },
            })
              .on("mouseout", function () {
                _this.isShow = false;
              })
              .on(
                "mouseenter",
                debounce(function (e) {
                  _this.centerLinesLayer.getGeometries().forEach((element) => {
                    if (element == e.target) {
                      el = document.getElementById("informationPanel");
                      _this.isShow = true;
                      _this.myTitleName = element.properties.name;
                      _this.myType = element.properties.type;
                      _this.myDataList = [
                        {
                          fieldName: "所属通道",
                          value: element.properties.channelName,
                        },
                        {
                          fieldName: "分区起点：",
                          value: element.properties.channelStartNum,
                        },
                        {
                          fieldName: "分区终点：",
                          value: element.properties.channelEndNum,
                        },

                        // {
                        //   fieldName: "起点经纬度：",
                        //   value: element.properties.pointDataStart,
                        // },
                        // {
                        //   fieldName: "中点经纬度：",
                        //   value: element.properties.pointDataEnd,
                        // },
                      ];
                      marker = new maptalks.ui.UIMarker(e.coordinate, {
                        draggable: false,
                        single: false,
                        content: el,
                        dx: -0,
                        dy: -90,
                      });
                      marker.addTo(_this.maptalksMap).show();
                      _this.lastClickedPoint = e.target;
                    }
                  });
                }, 200)
              );

            this.lines.push(line);
          }
        });
        this.centerLinesLayer.addGeometry(_this.lines);
        this.centerLinesLayer.setZIndex(999);
      });
    },

    getliner(id, data) {
      let _this = this;
      let el, marker;
      let line = this.centerLinesLayer.getGeometryById(id);

      line.properties.warningTime = data.warningTime;
      line.properties.channelStartNum = data.startPosition;
      line.properties.channelEndNum = data.endPosition;
      line.properties.alarmType = _this.getAlarmLabel(data.alarmType);
      line.setSymbol({ lineColor: "red", lineWidth: 5 });
      line.on(
        "mouseenter",
        debounce(function (e) {
          _this.centerLinesLayer.getGeometries().forEach((element) => {
            if (element == e.target) {
              el = document.getElementById("informationPanel");
              _this.isShow = true;
              _this.myTitleName = element.properties.name;
              _this.myType = element.properties.type;
              _this.myDataList = [
                {
                  fieldName: "报警分区：",
                  value: element.properties.name,
                },
                {
                  fieldName: "报警点：",
                  value:
                    element.properties.channelStartNum +
                    "-" +
                    element.properties.channelEndNum,
                },
                {
                  fieldName: "报警类型",
                  value: element.properties.alarmType,
                },
              ];
              marker = new maptalks.ui.UIMarker(e.coordinate, {
                draggable: false,
                single: false,
                content: el,
                dx: -0,
                dy: -90,
              });
              marker.addTo(_this.maptalksMap).show();
              _this.lastClickedPoint = e.target;
            }
          });
        }, 200)
      );
    },

    async addRoadThreeLayer() {
      var _this = this;
      var threeLayer = new ThreeLayer("threeLayerRoad", {
        forceRenderOnMoving: false,
        forceRenderOnRotating: false,
        minZoom: 5,
        maxZoom: 22,
        // animation: true
      });
      threeLayer.addTo(_this.maptalksMap);
      threeLayer.prepareToDraw = function (gl, scene, camera) {
        // var light = new THREE.DirectionalLight("rgb(60,60,188)");
        // light.position.set(0, -10, 10).normalize();
        // scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI));
        _this.showLine = _this.$route.query.isShow;
        if (_this.showLine === "1" && _this.showLine != undefined) {
          //材质必须放在static目录中
        }
        var zhuji = require(`../../assets/image/zhuji.png`);
        addSpriteLinesLayer(zhuji);
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
          far: camera.far,
        });
        let multiLineStrings = maptalks.GeoJSON.toGeometry(geojson);
        for (let multiLineString of multiLineStrings) {
          let lines = multiLineString._geometries.map((lineString) => {
            if (lineLength(lineString) > 100) {
              return new SpriteLine(
                lineString,
                { altitude: 0, speed: 0.0008 },
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
        forceRenderOnRotating: false,
        // animation: true
      });
      threeLayer.addTo(_this.maptalksMap);
      threeLayer.prepareToDraw = function (gl, scene, camera) {
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
        }, 2000);
        animation();
      };
      function addWater() {
        animation();
      }

      // }
      var groundWall, material;

      function addRippleWall() {
        var boundMax = require(`./data/boundPolygon.json`);
        let multiLineStrings = maptalks.GeoJSON.toGeometry(boundMax);
        var item;
        var itemList = [];
        multiLineStrings.map((p) => {
          item = p.getGeometries()[0].getCoordinates();
          item.map((n) => {
            n.map((m) => {
              itemList.push([m.x, m.y]);
            });
          });
        });
        material = getWallMaterial();
        material.uniforms.color.value.setStyle("#34C5DC");
        material.uniforms.opacity.value = 1;

        groundWall = new RippleWall(
          [itemList][0],
          { height: 100000, speed: 0.025 },
          material,
          threeLayer
        );
        threeLayer.addMesh(groundWall);

        setInterval(() => {
          groundWall.animateShow({
            duration: 3000,
          });
        }, 5000);
      }
      function getWallMaterial() {
        const vertexs = {
          normal_vertex: "\n  precision lowp float;\n  precision lowp int;\n  "
            .concat(
              THREE.ShaderChunk.fog_pars_vertex,
              "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
            )
            .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        };

        const fragments = {
          rippleWall_fragment:
            "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  uniform float num;\n  uniform float hiz;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec4 fragColor = vec4(0.);\n    float sin = sin((vUv.y - time * hiz) * 10. * num);\n    float high = 0.92;\n    float medium = 0.4;\n    if (sin > high) {\n      fragColor = vec4(mix(vec3(.8, 1., 1.), color, (1. - sin) / (1. - high)), 1.);\n    } else if(sin > medium) {\n      fragColor = vec4(color, mix(1., 0., 1.-(sin - medium) / (high - medium)));\n    } else {\n      fragColor = vec4(color, 0.);\n    }\n\n    vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);\n    fragColor = mix(fragColor, vec4(fade, 1.), 0.85);\n    gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));\n  }\n",
        };
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: {
              type: "pv2",
              value: 0,
            },
            color: {
              type: "uvs",
              value: new THREE.Color("#0099FF"),
            },
            opacity: {
              type: "pv2",
              value: 1,
            },
            num: {
              type: "pv2",
              value: 5,
            },
            hiz: {
              type: "pv2",
              value: 0.15,
            },
          },
          vertexShader: vertexs.normal_vertex,
          fragmentShader: fragments.rippleWall_fragment,
          blending: THREE.AdditiveBlending,
          transparent: !0,
          depthWrite: !1,
          depthTest: !0,
          side: THREE.DoubleSide,
        });
        return material;
      }
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

    async flyToView() {
      var _this = this;
      _this.maptalksMap.animateTo(
        {
          // center: [87.617733, 43.792818],
          center: this.MapCenter || [116.38821589024599, 39.97533303800978],
          zoom: 8.5,
          pitch: 0,
          bearing: 0,
        },
        {
          duration: 2000,
        }
      );
      setTimeout(() => {
        _this.maptalksMap.animateTo(
          {
            // center: [84.65767573322091, 41.00901531447968],
            center: this.MapCenter || [116.38821589024599, 39.97533303800978],
            zoom: 13,
            pitch: 60,
            bearing: 32,
          },
          {
            duration: 4000,
          }
        );
      }, 2000);

      _this.initAddLayers();

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
        mouseControl: true,
      });
    },
    formatCoordinates(coordinates) {
      const result = [];

      for (let i = 0; i < coordinates.length; i++) {
        if (i + 1 >= coordinates.length) {
          break;
        }
        const pair = [coordinates[i], coordinates[i + 1]];

        result.push(pair);
      }
      return result;
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
  destroyed() {
    if (window.animationFrameID1 !== null) {
      cancelAnimationFrame(window.animationFrameID1);
    }
    if (window.animationFrameID2 !== null) {
      cancelAnimationFrame(window.animationFrameID2);
    }
  },
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
  background-image: url("../../assets/image/map-mask.png");
  background-size: 100% 100%;
}
</style>
