<template>
  <div style="height: 100%; width: 100%">
    <div id="map"
         class="map"></div>
    <div class="map-mask"></div>
    <InformationPanel id="informationPanel1"
                      v-show="isShow"
                      :titleName="myTitleName"
                      :dataList="myDataList"
                      :type="myType"></InformationPanel>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import api from '@/api/api'
import * as THREE from 'three'

import { debounce } from 'loadsh'
import { MeshLineMaterial } from './js/THREE.MeshLine'
import SpriteLine from './feature/SpriteLine'
import CoolWater from './feature/CoolWater'

import RippleWall from './feature/RippleWall'

import { lineLength } from './js/geoutil'

import * as maptalks from 'maptalks'
import 'maptalks/dist/maptalks.css'
import { ThreeLayer } from 'maptalks.three/dist/maptalks.three.js' //必须按这种方式import
import Rotate from './js/rotate'
import mapboxgl from 'mapbox-gl'

import { MapboxglLayer } from 'maptalks.mapboxgl'
import roads from './data/yuanyang/roads.json'
import InformationPanel from './Panel/InformationPanel'
import waterJson from './data/yuanyang/water.json'

import { bd09towgs84 } from '@/utils/map'
const edgeColor = '#87CEFA'
const polygonColors = ['#C0C0C0', '#00BAB7']
export default {
  name: 'MainMap',
  props: {
    bussineType: [String], //业务类型:一张图 militaryaffairs，
  },
  data() {
    return {
      rotateObj: null, // 地图旋转
      isShow: false, //机构概况弹窗
      polygons: [],
      streetsPointLayer: null, //乡镇图层
      myTitleName: '', //弹窗名称
      myType: '', //点类型
      lastClickedPoint: null, //存储点击的社区、乡镇点、街道
      points: [], //存储区县点位
      myDataList: [],
      srceenSize: [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
      ], //屏幕大小
      center: [102.85334629093654, 23.255827091718714],
      markerFile: require(`../../assets/img/communityNcx.png`),
      markerFileOne: require(`../../assets/img/communityOne.png`),
      markerFileTwo: require(`../../assets/img/communityTwo.png`),
      markerFileThree: require(`../../assets/img/communityThree.png`),
    }
  },
  components: {
    InformationPanel,
  },
  beforeMount() {},
  mounted() {
    window.animationFrameID1 = null
    window.animationFrameID2 = null
    this.myBussineType = this.$route.name.toLowerCase()
    window.onresize = () => {
      return (() => {
        this.srceenSize.clientWidth = document.documentElement.clientWidth //窗口宽度
        this.srceenSize.screenHeight = document.documentElement.clientHeight //窗口高度
      })()
    }
    this.$nextTick(() => {
      this.initMapTalksMap()
    })
  },
  watch: {
    srceenSize: {
      immediate: true,
      handler: function (newValue) {
        console.log(newValue, 'oojojwie')
      },
    },
  },
  methods: {
    initMapTalksMap() {
      var _this = this
      mapboxgl.accessToken =
        'pk.eyJ1IjoidGFuZ2p1bmNoZW5nIiwiYSI6ImNqa3c5eWR5MjBmNXQzdnBjaWZsbm9kZTAifQ.Qeen8x41i5GTOCjLJVId4Q'
      this.mapboxBaseLayer = new MapboxglLayer('tile', {
        glOptions: {
          style: 'mapbox://styles/tangjuncheng/cl7znwh0g000814pchaic6d6t',
        },
      })
      var bound = [115.258112, 30.017277, 116.831081, 29.203385]
      this.maptalksMap = new maptalks.Map('map', {
        center: _this.center,
        zoom: 9,
        minZoom: 9,
        maxZoom: 22,
        // pitch: 44.4,
        pitch: 0,

        // bearing: -5.800000000000409,
        bearing: 0,
        maxPitch: 60,
        centerCross: false,
        // draggable: false, //disable drag
        // dragPan: false, //disable drag panning
        // dragRotate: false, //disable drag rotation
        // dragPitch: false, //disable drag pitch
        // scrollWheelZoom: false, //disable wheel zoom
        // touchZoom: false, //disable touchzoom
        // doubleClickZoom: false, //disable doubleclick zoom
        baseLayer: this.mapboxBaseLayer,
      })
      window.maptalksMap = this.maptalksMap
      document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display =
        'none'
      document.getElementsByClassName(
        'mapboxgl-ctrl-attrib-inner'
      )[0].style.display = 'none'
      document.getElementsByClassName('maptalks-attribution')[0].style.display =
        'none'
      _this.flyToView()

      this.maptalksMap.on('dblclick', function (e) {
        // console.log(
        //   _this.maptalksMap.getCenter(),
        //   _this.maptalksMap.getPitch(),
        //   _this.maptalksMap.getBearing(),
        //   "sdsdsd"
        // );
        var centerPointLayer = _this.maptalksMap.getLayer('centerPointLayer')
        var layers = []
        if (centerPointLayer !== null) layers.push(centerPointLayer)

        //identify
        _this.maptalksMap.identify(
          {
            coordinate: e.coordinate,
            layers: layers,
          },
          function (geos) {
            if (geos.length === 0) {
              _this.isShow = false
              _this.centerPointLayer.getGeometries().forEach((element) => {
                element.updateSymbol({
                  //   markerFile: require(`../../assets/img/community.png`),
                  //   markerWidth: 25 / 1.5,
                  //   markerHeight: 41 / 1.5,
                  textName: '{labelName}', //value from name in geometry's properties
                  textWeight: 'normal', //'bold', 'bolder'
                  textStyle: 'normal', //'italic', 'oblique'
                  textSize: 14,
                  textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                  textFill: '#FFFFFF',
                  textOpacity: 1,
                  textHaloFill: '#00DDFF',
                  textHaloRadius: 0.1,
                  textWrapWidth: null,
                  textWrapCharacter: '\n',
                  textLineSpacing: 2,
                  textDx: 0,
                  textDy: -40,
                  textHorizontalAlignment: 'middle', //left | middle | right | auto
                  textVerticalAlignment: 'middle', // top | middle | bottom | auto
                  textAlign: 'center', //left | right | center | auto
                })
              })
              return
            }
          }
        )
      })
      this.maptalksMap.on('click', function (e) {
        /**
         * 移出地图范围，关闭弹窗
         */
        _this.isShow = false
      })
    },
    initAddLayers() {
      this.addCenterPoints()
    },

    /**
     * 添加中心点
     */
    addCenterPoints() {
      var _this = this
      var el
      var marker
      if (_this.maptalksMap.getLayer('centerPointLayer')) {
        _this.maptalksMap.removeLayer(
          _this.maptalksMap.getLayer('centerPointLayer')
        )
      }
      this.centerPointLayer = new maptalks.VectorLayer('centerPointLayer', [], {
        enableAltitude: true,
        altitudeProperty: 'altitude',
      }).addTo(this.maptalksMap)
      let data = [
        {
          companyname: '元阳丁丁农电子商务有限公司',
          lon: 102.853982,
          lat: 23.22024,
          wllse: 39.8,
          dpsl: 1,
        },
        {
          companyname: '元阳涌鑫茶叶有限公司',
          lat: '23.093061',
          lon: '103.030104',
          wllse: 31.6,
          dpsl: 2,
        },
        {
          companyname: '元阳县粮食购销有限公司',
          lon: 102.755124,
          lat: 23.16141,
          wllse: 18.9,
          dpsl: 1,
        },
        // {
        //   companyname: '建水县陶宜轩紫陶坊',
        //   lon: 102.815518,
        //   lat: 23.632812,
        //   wllse: 17,
        //   dpsl: 1,
        // },

        {
          companyname: '元阳县牛牛姐姐农业发展有限公司',
          lat: '23.228382',
          lon: '102.837149',
          wllse: 14.3,
          dpsl: 1,
        },
        // {
        //   companyname: '滇园优选食品(红河)有限公司',
        //   lon: 102.831389,
        //   lat: 24.885957,
        //   wllse: 13.5,
        //   dpsl: 2,
        // },
        {
          companyname: '云南元阳酸老二食品开发厂',
          lat: '23.206279',
          lon: '102.642436',
          wllse: 9.7,
          dpsl: 1,
        },
        {
          companyname: '元阳县新街镇志宏副食经营部',
          lon: 102.75265,
          lat: 23.15953,
          wllse: 6.1,
          dpsl: 1,
        },
        {
          companyname: '元阳轩品源农业发展有限公司',
          lat: '23.123077',
          lon: '102.746174',
          wllse: 1.5,
          dpsl: 1,
        },
        {
          companyname: '元阳县丰润托运服务部',
          lon: 102.841433,
          lat: 23.226198,
          wllse: 0.8,
          dpsl: 1,
        },
      ]
      data.forEach((item, index) => {
        let markerFile, markerWidth
        if (index == 0) {
          markerFile = this.markerFileOne
          markerWidth = 55
        } else if (index == 1) {
          markerFile = this.markerFileTwo
          markerWidth = 50
        } else if (index == 2) {
          markerFile = this.markerFileThree
          markerWidth = 45
        } else {
          markerFile = this.markerFile
          markerWidth = 40
        }
        var lnglat = bd09towgs84(item.lon, item.lat)
        console.log(lnglat)
        if (item !== undefined) {
          var value = item.wllse
          var point = new maptalks.Marker(lnglat, {
            properties: {
              altitude: 50,
              name: item.companyname,
              labelName: '',

              value: value || 0,
              wllse: item.wllse || 0,
              wllsj: item.sumSellcount || 0,
              dpsl: item.dpsl || 0,
              type: 'other',
            },
            symbol: [
              {
                markerFile: markerFile,
                markerWidth: markerWidth,
                markerHeight: 40,
                markerDx: 0,
                markerDy: 0,
                markerOpacity: 1,
              },
              {
                textName: '{labelName}', //value from name in geometry's properties
                textWeight: 'normal', //'bold', 'bolder'
                textStyle: 'normal', //'italic', 'oblique'
                textSize: 14,
                textFont: null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
                textFill: '#FFFFFF',
                textOpacity: 1,
                textHaloFill: '#00DDFF',
                textHaloRadius: 0.1,
                textWrapWidth: null,
                textWrapCharacter: '\n',
                textLineSpacing: 0,
                textDx: 0,
                textDy: -40,
                textHorizontalAlignment: 'middle', //left | middle | right | auto
                textVerticalAlignment: 'middle', // top | middle | bottom | auto
                textAlign: 'center', //left | right | center | auto
              },
            ],
          })
            .on('mouseenter', function (e) {
              _this.isShow = true
              e.target.updateSymbol({
                //   markerFile: require(`../../assets/img/community.png`),
                //   markerWidth: 25,
                //   markerHeight: 41,
                textFaceName: 'sans-serif',
                textName: '{labelName}',
                textWeight: 'normal',
                textStyle: 'normal',
                textSize: 0,
                textFont: null,
                textFill: '#FFFFFF',
                textOpacity: 1,
                textHaloFill: '#00DDFF',
                textHaloRadius: 0.1,
                textWrapWidth: null,
                textWrapCharacter: '\n',
                textLineSpacing: 2,
                textDx: 0,
                textDy: -40,
                textHorizontalAlignment: 'middle',
                textVerticalAlignment: 'middle',
                textAlign: 'center',
              })
              var element = e.target
              el = document.getElementById('informationPanel1')
              _this.myTitleName = element.properties.name
              _this.myType = element.properties.type
              _this.myDataList = [
                {
                  fieldName: '网络零售额:',
                  value: element.properties.wllse,
                  unit: '万元',
                },

                {
                  fieldName: '店铺数量:',
                  value: element.properties.dpsl,
                  unit: '家',
                },
              ]
              marker = new maptalks.ui.UIMarker(e.target.getCoordinates(), {
                draggable: false,
                single: false,
                content: el,
                dx: -0,
                dy: -130,
              })
              marker.addTo(_this.maptalksMap).show()
            })
            .on('mouseout', function (e) {
              e.target.updateSymbol({
                //   markerFile: require(`../../assets/img/community.png`),
                //   markerWidth: 25 / 1.5,
                //   markerHeight: 41 / 1.5,
                textFaceName: 'sans-serif',
                textName: '{labelName}',
                textWeight: 'normal',
                textStyle: 'normal',
                textSize: 0,
                textFont: null,
                textFill: '#FFFFFF',
                textOpacity: 1,
                textHaloFill: '#00DDFF',
                textHaloRadius: 0.1,
                textWrapWidth: null,
                textWrapCharacter: '\n',
                textLineSpacing: 2,
                textDx: 0,
                textDy: -40,
                textHorizontalAlignment: 'middle',
                textVerticalAlignment: 'middle',
                textAlign: 'center',
              })
              _this.isShow = false
            })
          _this.points.push(point)
          // point.properties.labelName = item.companyname
        }
      })

      this.centerPointLayer.addGeometry(_this.points)

      this.centerPointLayer.setZIndex(999)
    },
    drawPolygons(idx, coordinates, properties) {
      const polygon = new maptalks.MultiPolygon(coordinates, {
        cursor: null,
        shadowBlur: 0,
        shadowColor: 'black',
        symbol: {
          lineWidth: 1,
          lineColor: edgeColor,
          lineDasharray: [0.2, 5], //线形
          polygonFill: polygonColors[0],
          polygonOpacity: 0.5,
        },
        properties: {
          id: properties.id,
          index: idx,
          properties: properties,
        },
      })
        .on('mouseenter', function (e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[1],
          })
          // var el = document.getElementById('information_panel')
          //  var marker = new maptalks.ui.UIMarker([116.404269, 39.914935], {
          //   'draggable': false,
          //   'single': false,
          //   'content': el
          // });
          // marker.addTo(this.maptalksMap).show();
        })
        .on('mouseout', function (e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[0],
          })
        })
      this.polygons.push(polygon)
    },
    async addRoadThreeLayer() {
      var _this = this
      var threeLayer = new ThreeLayer('threeLayerRoad', {
        forceRenderOnMoving: false,
        forceRenderOnRotating: false,
        minZoom: 5,
        maxZoom: 22,
        // animation: true
      })
      threeLayer.addTo(_this.maptalksMap)
      threeLayer.prepareToDraw = function (gl, scene, camera) {
        // var light = new THREE.DirectionalLight("rgb(60,60,188)");
        // light.position.set(0, -10, 10).normalize();
        // scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6))
        camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI))
        _this.showLine = _this.$route.query.isShow
        if (_this.showLine === '1' && _this.showLine != undefined) {
          //材质必须放在static目录中
        }
        var roadSprite = require(`../../assets/img/roadSprite.png`)
        addSpriteLinesLayer(roadSprite)
        animation()
      }
      var meshesRoads = []
      async function addSpriteLinesLayer(textureURL) {
        var geojson = roads // JSON.parse(geojson);
        let texture = new THREE.TextureLoader().load(textureURL)
        texture.anisotropy = 16
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        let camera = threeLayer.getCamera()
        let material = new MeshLineMaterial({
          map: texture,
          useMap: true,
          lineWidth: 8,
          sizeAttenuation: false,
          transparent: true,
          near: camera.near,
          far: camera.far,
        })
        let multiLineStrings = maptalks.GeoJSON.toGeometry(geojson)
        for (let multiLineString of multiLineStrings) {
          let lines = multiLineString._geometries.map((lineString) => {
            if (lineLength(lineString) > 100) {
              return new SpriteLine(
                lineString,
                { altitude: 0, speed: 0.0003 },
                material,
                threeLayer
              )
            } else {
              return null
            }
          })
          if (lines != null) {
            threeLayer.addMesh(lines)
            meshesRoads = meshesRoads.concat(lines)
          }
        }
      }
      function animation() {
        // layer animation support Skipping frames
        threeLayer._needsUpdate = !threeLayer._needsUpdate
        if (threeLayer._needsUpdate) {
          threeLayer.renderScene()
        }
        //stats.update();
        window.animationFrameID1 = requestAnimationFrame(animation)
      }
    },
    async addThreeLayer() {
      var _this = this
      var threeLayer = new ThreeLayer('threeLayer', {
        forceRenderOnMoving: false,
        forceRenderOnRotating: false,
        // animation: true
      })
      threeLayer.addTo(_this.maptalksMap)
      threeLayer.prepareToDraw = function (gl, scene, camera) {
        var light = new THREE.DirectionalLight('rgb(60,60,188)')
        light.position.set(0, -10, 10).normalize()
        scene.add(light)
        scene.add(new THREE.AmbientLight(0xffffff, 0.6))
        camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI))

        setTimeout(() => {
          addWater()
        }, 1000)
        setTimeout(() => {
          addRippleWall()
          //addGltfRotate();
          // addEffectLayer(_this.maptalksMap,[
          //   [113.9881564, 30.199253100000104],
          //   [113.9881564, 30.191253100000104]
          // ]);
        }, 2000)
        // addRingEffect([113.9881564, 30.199253100000104])
        //addElectricShield([114.043, 30.296])
        animation()
      }
      var waters
      function addWater() {
        // fetch("./data/westlake.json")
        //   .then(function(res) {
        //     return res.text();
        //   })
        //   .then(function(geojson) {
        var polygons = maptalks.GeoJSON.toGeometry(waterJson)
        waters = polygons.map((p) => new CoolWater(p, {}, threeLayer))

        threeLayer.addMesh(waters)

        //threeLayer.config("animation", true);
        animation()
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
      var groundWall, material

      function addRippleWall() {
        var boundMax = require(`./data/yuanyang/bound.json`)
        let multiLineStrings = maptalks.GeoJSON.toGeometry(boundMax)
        var item
        var itemList = []
        multiLineStrings.map((p) => {
          item = p.getGeometries()[0].getCoordinates()
          item.map((n) => {
            n.map((m) => {
              itemList.push([m.x, m.y])
            })
          })
        })
        material = getWallMaterial()
        material.uniforms.color.value.setStyle('#34C5DC')
        material.uniforms.opacity.value = 1

        groundWall = new RippleWall(
          [itemList][0],
          { height: 8000, speed: 0.025 },
          material,
          threeLayer
        )
        threeLayer.addMesh(groundWall)

        setInterval(() => {
          groundWall.animateShow({
            duration: 3000,
          })
        }, 5000)
        //animation();
      }
      function getWallMaterial() {
        const vertexs = {
          normal_vertex: '\n  precision lowp float;\n  precision lowp int;\n  '
            .concat(
              THREE.ShaderChunk.fog_pars_vertex,
              '\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    '
            )
            .concat(THREE.ShaderChunk.fog_vertex, '\n  }\n'),
        }

        const fragments = {
          rippleWall_fragment:
            '\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  uniform float num;\n  uniform float hiz;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec4 fragColor = vec4(0.);\n    float sin = sin((vUv.y - time * hiz) * 10. * num);\n    float high = 0.92;\n    float medium = 0.4;\n    if (sin > high) {\n      fragColor = vec4(mix(vec3(.8, 1., 1.), color, (1. - sin) / (1. - high)), 1.);\n    } else if(sin > medium) {\n      fragColor = vec4(color, mix(1., 0., 1.-(sin - medium) / (high - medium)));\n    } else {\n      fragColor = vec4(color, 0.);\n    }\n\n    vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);\n    fragColor = mix(fragColor, vec4(fade, 1.), 0.85);\n    gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));\n  }\n',
        }
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: {
              type: 'pv2',
              value: 0,
            },
            color: {
              type: 'uvs',
              value: new THREE.Color('#0099FF'),
            },
            opacity: {
              type: 'pv2',
              value: 1,
            },
            num: {
              type: 'pv2',
              value: 5,
            },
            hiz: {
              type: 'pv2',
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
        })
        return material
      }

      function animation() {
        // layer animation support Skipping frames
        threeLayer._needsUpdate = !threeLayer._needsUpdate
        if (threeLayer._needsUpdate) {
          threeLayer.renderScene()
        }
        //stats.update();
        window.animationFrameID2 = requestAnimationFrame(animation)
      }
    },
    async flyToView() {
      var _this = this
      _this.maptalksMap.animateTo(
        {
          center: _this.center,
          zoom: 8.5,
          pitch: 0,
          bearing: 0,
        },
        {
          duration: 2000,
        }
      )
      setTimeout(() => {
        _this.maptalksMap.animateTo(
          {
            center: _this.center,
            zoom: 10.7,
            pitch: 60,
            bearing: 5,
          },
          {
            duration: 4000,
          }
        )
      }, 2000)
      var extent = _this.maptalksMap.getExtent()
      _this.maptalksMap.setMaxExtent(extent)
      setTimeout(() => {
        _this.initAddLayers()
      }, 1000)
      setTimeout(() => {
        _this.addThreeLayer()
        _this.addRoadThreeLayer()

        // _this.addBloomThreeLayer();
      }, 5000)

      //   _this.rotateMap()
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
      })
    },
  },
  destroyed() {
    if (window.animationFrameID1 !== null) {
      cancelAnimationFrame(window.animationFrameID1)
    }
    if (window.animationFrameID2 !== null) {
      cancelAnimationFrame(window.animationFrameID2)
    }
  },
}
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
  background-image: url('../../assets/img/nanchangxian-map-mask.png');
  background-size: 100% 100%;
}
</style>
