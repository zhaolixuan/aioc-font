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
export default {
  name: "MainMap",

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
        document.documentElement.clientHeight,
      ], //屏幕大小
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
    this.$nextTick(() => {
      this.initMapTalksMap();
    });
  },
  watch: {
    srceenSize: {
      immediate: true,
      handler: function (newValue) {
        console.log(newValue, "oojojwie");
      },
    },
  },
  methods: {
    initMapTalksMap() {
      var _this = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoiemhhb2xpeHVhbiIsImEiOiJja2V2ODQ1djAyNHY3MnhxdmZ5YTY3YWEzIn0.CItJzP4ZEAoBd0Pv8SUUGg";
      this.mapboxBaseLayer = new MapboxglLayer("tile", {
        glOptions: {
          style: "mapbox://styles/zhaolixuan/clj0s1h4b00gp01pw7jg20h5i",
        },
      });
      this.maptalksMap = new maptalks.Map("map", {
        center: [87.617733, 43.792818], //[116.404269, 39.914935],
        zoom: 9,
        minZoom: 3,
        maxZoom: 22,
        pitch: 0,
        bearing: 0,
        maxPitch: 60,
        dragPitch: false,
        centerCross: false,
        doubleClickZoom: false,
        baseLayer: this.mapboxBaseLayer,
      });

      document.getElementsByClassName("mapboxgl-ctrl-logo")[0].style.display =
        "none";
      document.getElementsByClassName(
        "mapboxgl-ctrl-attrib-inner"
      )[0].style.display = "none";
      document.getElementsByClassName("maptalks-attribution")[0].style.display =
        "none";
      _this.flyToView();

      this.maptalksMap.on("dblclick", function (e) {
        console.log(e.coordinate);
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
              _this.isShow = false;
              _this.centerPointLayer.getGeometries().forEach((element) => {
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
        _this.isShow = false;
      });
    },
    initAddLayers() {
      // this.addCenterPoints();
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
      this.centerPointLayer = new maptalks.VectorLayer("centerPointLayer", [], {
        enableAltitude: true,
        altitudeProperty: "altitude",
      }).addTo(this.maptalksMap); //centerPointData

      api.getWholeNetworkJiujiangIndexList().then((res) => {
        var data = res.records;
        if (data.length > 0) {
          var lnglat = [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ];
          var item = data.filter(
            (item) => item.district == feature.properties.name
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
                type: "other",
              },
              symbol: [
                {
                  markerFile: require(`../../assets/img/community.png`),
                  markerWidth: 25 / 1.5,
                  markerHeight: 41 / 1.5,
                  markerDx: 0,
                  markerDy: 0,
                  markerOpacity: 1,
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
                  textAlign: "center", //left | right | center | auto
                },
              ],
            })
              .on("mouseout", function () {
                _this.isShow = false;

                if (
                  _this.centerPointLayer != null &&
                  _this.centerPointLayer.getGeometries().length > 0
                ) {
                  _this.isShow = false;
                  _this.centerPointLayer.getGeometries().forEach((element) => {
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
                        textAlign: "center", //left | right | center | auto
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
                        textAlign: "center", //left | right | center | auto
                      });
                    }
                  });
                }
              })
              .on(
                "mouseenter",
                debounce(function (e) {
                  _this.centerPointLayer.getGeometries().forEach((element) => {
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
                          textAlign: "center", //left | right | center | auto
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
                        textAlign: "center",
                      });
                      el = document.getElementById("informationPanel");
                      _this.isShow = true;
                      _this.myTitleName = element.properties.name;
                      _this.myType = element.properties.type;
                      _this.myDataList = [
                        {
                          fieldName: "网络零售额：",
                          value: element.properties.wllse,
                          unit: "万元",
                        },
                        // {
                        //   fieldName: "同比：",
                        //   value: element.properties.tb,
                        //   unit: "%"
                        // },

                        {
                          fieldName: "店铺数量：",
                          value: element.properties.dpsl,
                          unit: "家",
                        },
                        {
                          fieldName: "企业数：",
                          value: element.properties.qys,
                          unit: "家",
                        },
                      ];
                      marker = new maptalks.ui.UIMarker(
                        e.target.getCoordinates(),
                        {
                          draggable: false,
                          single: false,
                          content: el,
                          dx: -0,
                          dy: -130,
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
                      markerFile: require(`../../assets/img/community.png`),
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
              feature.properties.name + " " + item.salesamountRank;
          }
          this.centerPointLayer.addGeometry(_this.points);
        }
      });

      this.centerPointLayer.setZIndex(999);
    },

    addLiners() {
      let linerList = [];
      let data = [
        [
          [87.29075215756086, 43.831270468528686],
          [87.51104516347652, 43.62870369331276],
        ],
        [
        [87.51104516347652, 43.62870369331276],
          [87.52903114251455, 43.59056209551258],
        ],
      ];

      data.forEach((i) => {
        let line = new maptalks.LineString(i, {
          // arrowStyle : null, // arrow-style : now we only have classic
          // arrowPlacement : 'vertex-last', // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
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
        linerList.push(line);
      })

      window.map = this.maptalksMap;
      this.linersList = new maptalks.VectorLayer("vector", linerList).addTo(this.maptalksMap);

      this.getliner(this.linersList, [87.51104516347652, 43.62870369331276],)

    },

    getliner(lines, startCoord) {
      // console.log(lines, startCoord);
      // 假设已经创建了多个线段，并将其存储在一个数组中
      // var lines = [line1, line2, line3, ...];

      // 定义起始点位
      // var startCoord = [x, y];

      // 遍历线段数组
      for (var i = 0; i < lines._geoList.length; i++) {
        var line = lines._geoList[i];
        console.log('line.getCoordinates()',line.getCoordinates());

        // 获取线段的起始点位和结束点位
        var start = line.getCoordinates()[0];
        // var end = line.getCoordinates()[1];
        let point = [start.x,start.y]
        JSON.stringify(point)
        // 判断起始点位是否与给定的起始点位相同
        if (JSON.stringify(point) == JSON.stringify(startCoord)) {
          // 找到了对应的线段
          console.log("找到了对应的线段：" , line);
          line.setSymbol({'lineColor':'red','lineWidth':5})
          // line.set_symbol({  lineColor: "red"})
          break;
        }
      }
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
          far: camera.far,
        });
        let multiLineStrings = maptalks.GeoJSON.toGeometry(geojson);
        // console.log('multiLineStrings',multiLineStrings);
        for (let multiLineString of multiLineStrings) {
          // console.log('multiLineString',multiLineString);
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
          center: [87.617733, 43.792818],
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
            center: [87.617733, 43.792818],
            zoom: 9,
            pitch: 60,
            bearing: 32,
          },
          {
            duration: 4000,
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
        mouseControl: true,
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
  background-image: url("../../assets/img/map-mask.png");
  background-size: 100% 100%;
}
</style>
