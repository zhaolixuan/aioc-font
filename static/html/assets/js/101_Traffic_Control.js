/**********************************
 * Description: by IntelliJ IDEA.
 * Author: diaolili
 * Date: 2019/2/22 17:58
 * Example:
 ***********************************/
var resource_czml = [{
  'id': 'document',
  'name': '应急资源',
  'version': '1.0',
  'clock': {
    'currentTime': '2012-08-04T16:00:00Z'
  }
}]

$(document).ready(function () {
  if (!cs3d.util.webglreport()) {
    alert('系统检测到您使用的浏览器不支持WebGL功能')
    layer.open({
      type: 1,
      title: '当前浏览器不支持WebGL功能',
      closeBtn: 0,
      shadeClose: false,
      resize: false,
      area: ['600px', '200px'], // 宽高
      content: '<div style="margin: 20px;"><h3>系统检测到您使用的浏览器不支持WebGL功能！</h3>  <p>1、请您检查浏览器版本，安装使用最新版chrome、火狐或IE11以上浏览器！</p> <p>2、WebGL支持取决于GPU支持，请保证客户端电脑已安装显卡驱动程序！</p></div>'
    })
  }
  $(".bigScreen1").width(417 * $("body").width() / 1920 ).append("<iframe src='http://ultrav-console.jdcloud.com/previewScreen?id=2E3EBEV12_20190223115655' width='"+$("body").width()+"' height='100%' frameBorder='0' scrolling='no' allowtransparency='true'></iframe>")
  $(".bigScreen2").width(400 * $("body").width() / 1920 )
  $("<iframe src='http://ultrav-console.jdcloud.com/previewScreen?id=2E59PHF6Q_20190223143822' width='"+$("body").width()+"' height='100%' frameBorder='0' scrolling='no' allowtransparency='true' style='position:absolute;right:-10px;top:-80px;'></iframe>").insertBefore($(".right_pop"))
  initMap()
})
$('.inform ul li.active').click(function () {
  $('.pop_main').fadeIn('slow')
  $('.bigScreen1,.bigScreen2').hide()
  $('.right_pop').hide()
  flyToAccidentPoi({ x: '117.06163', y: '36.65077' })
})
$('.find_zy').click(function () {
  $('.pop_main').fadeOut('slow')
  resourcePoi()
})
$('.yjld_button').click(function () {
  $('.fa_pop').fadeOut('slow')
  carPath()
})
function removeMask () {
  $('#mask').remove()
}
var viewer
// 初始化默认地图
function initMap (map) {
  cs3d.createMap({
    id: 'cesiumContainer',
    data: {
      'center': { 'y': 36.491638, 'x': 116.996955, 'z': 7620.2, 'heading': 1.4, 'pitch': -25.4, 'roll': 0 },
      'minzoom': 20,
      'maxzoom': 20000000,
      'style': { 'atmosphere': true, 'lighting': false, 'fog': false, 'testTerrain': false },
      'controls': [
        { 'type': 'location' },
        { 'type': 'navigation', 'style': { 'top': '50px', 'right': '2px' } }
      ],
      'terrain': { 'visible': false },
      'crs': 'gcj',
      'basemaps': 'mapbox',
      'operationallayers': [],
      'imageryProvider': new Cesium.MapboxImageryProvider({ mapId: 'mapbox.dark' })
    },
    success: function (_viewer, gisdata, jsondata) { // 地图成功加载完成后执行
      viewer = _viewer

      viewer.scene.globe.depthTestAgainstTerrain = true

      cs3d.widget.init(_viewer)
      cs3d.jdWidget.init(_viewer)

      removeMask()
      initWork()
    }
  })
}
// 当前页面业务相关
function initWork () {
  // 激活使用widget
  /* cs3d.widget.activate({
    viewer: viewer,
    name: "书签",
    uri: "../assets/js/widgets/bookmark/widget.js",
    style: "dark",
    windowOptions: {
        "skin": "layer-mars-dialog animation-scale-up",
        "position": "r",
        "maxmin": false,
        "resize": true
    },
    success: function (item) {
        //返回widget.js定义的类
    }
  }); */
  accidentPoi()
}

function flyToAccidentPoi (point) {
  viewer.imap.centerAt({ 'y': 36.586436, 'x': 117.057156, 'z': 3593.5, 'heading': 1.4, 'pitch': -25.4, 'roll': 0 })
}

// 事故点
function accidentPoi () {
  cs3d.jdWidget.activate({
    id: '#01-02',
    name: '事故点',
    uri: '/static/html/assets/js/widget_waterWave.js',
    disableOhter: false,
    data: {
      positions: [[117.06163, 36.65077], [116.992889, 36.649572], [117.127868, 36.682022], [117.010868, 36.620822]], // 经纬度数组
      waterWaveRadus: 400, // 水波纹半径
      waterWaveHeight: 10, // 水波纹离地高度
      barHeight: 200, // 水波纹中间棍儿的高度
      color: [new Cesium.Color(1, 0, 0, 0.6), Cesium.Color.fromCssColorString('rgba(255, 111, 0,0.2)'), Cesium.Color.fromCssColorString('rgba(0, 128, 255,0.2)'), Cesium.Color.fromCssColorString('rgba(0, 128, 255,0.2)')] // 水波纹颜色
    }
  })
}

// 资源
function resourcePoi () {
  // 雷达扫描
  var radar = cs3d.jdWidget.activate({
    id: '#01-04',
    uri: '/static/html/assets/js/widget_radar.js',
    disableOhter: false,
    data: [{
      position: [117.06163, 36.65077],
      radus: 6000,
      color: new Cesium.Color.fromCssColorString('rgba(18, 227, 225, 0.6)')
    }]
  })
  addResource()
}

var resourceDs; var resLabel = []; var resInterval
function addResource () {
  // 资源加载
  $.getJSON('/static/data/resource.json', function (result) {
    result.map((el, i) => {
      let label = '可调车辆：' + el.cars + '辆'
      if (el.type === 'safe' || el.type === 'environmental') {
        label = '可调设备：' + el.cars + '台'
      }
      resource_czml.push({
        'id': el.type + '_m_' + i + '_01',
        'name': el.name,
        'model': {
          'gltf': '/static/model/' + el.type + '.gltf',
          'colorBlendAmount ': 0.1,
          'scale': 0.8,
          'nodeTransformations': {
            'node1': {
              'rotation': {
                'unitQuaternion': [
                  0.0, 0.0, 0.0, 1.0
                ]
              },
              'translation': {
                'cartesian': [
                  4.0, 5.0, 6.0
                ]
              }
            }
          }
        },
        /* 'billboard': {
          'image': 'img/jinan/' + el.type + '_m.png',
          'scale': 0.5
        }, */
        'properties': {
          'selected': el.selected || 0
        },
        'position': {
          'interpolationAlgorithm': 'LAGRANGE',
          'interpolationDegree': 1,
          'interval': '2012-08-04T16:00:0' + i + 'Z/2022-08-04T17:00:00Z',
          'cartographicDegrees': [el.x, el.y, 0]
        }
      }/*, {
        'id': el.type + '_t_' + i + '_01',
        'name': el.name,
        'billboard': {
          'image': 'img/jinan/' + el.type + '_t.png',
          'scale': 0.5
        },
        'label': {
          'text': label + '\n可调人员：' + el.icu + '人',
          'font': '5px Lucida Console',
          'horizontalOrigin': 'LEFT',
          'verticalOrigin': 'TOP',
          'pixelOffset': {
            'cartesian2': [-50, -25]
          }
        },
        'properties': {
          'selected': el.selected || 0
        },
        'position': {
          'interpolationAlgorithm': 'LAGRANGE',
          'interpolationDegree': 1,
          'interval': '2012-08-04T16:00:0' + i + 'Z/2022-08-04T17:00:00Z',
          'cartographicDegrees': [el.x - 0.00050, el.y, 270]
        }
      } */)
      resLabel.push({
        'name': el.name,
        'typeName': el.typeName,
        'persons': el.icu,
        'cars': el.cars,
        'icon': el.icon
      })
    })
    resLabel.reverse()

    resourceDs = new Cesium.CzmlDataSource('resource_czml')
    viewer.dataSources.add(resourceDs)
    resourceDs.process(resource_czml).then(function () {
      $('.list_pop').show()
      resInterval = setInterval(loadResourceLabel, 1000)
    })
  })
}
function loadResourceLabel () {
  if (resLabel.length === 0) {
    clearInterval(resInterval)
    setTimeout(function () {
      cs3d.jdWidget.disable('#01-04')
      $('.list_pop').hide()
      $('.fa_pop').show()
      if (resourceDs.entities.values.length > 0) {
        resourceDs.entities.values.map((el, i) => {
          if (el.id.indexOf('_t_') > 0 || el.properties.selected._value === 0) {
            el.show = false
          }
          if (el.label) {
            el.label.show = false
          }
        })
      }
    }, 15000)
  }else{
    let el = resLabel.pop()
    let str = "<li><p><i><img src='img/" + el.icon + ".png'> </i><em>机构名称：" + el.name + '</em></p><p><em><span>可调人员：' + el.persons + '人</span><b>|</b><span>可调车辆：' + el.cars + '辆</span></em></p>\</li>'
    $('.list_pop ul').append(str)
  }
}
// 车辆
function carPath () {
  $.getJSON('/static/data/car_path.json', function (result) {
    let now = Cesium.JulianDate.now()
    let totalTime = 0
    let path_czml = [{
      'id': 'document',
      'name': '应急车辆路径',
      'version': '1.0',
      'clock': {
        currentTime: now.toString(),
        multiplier: 1
      }
    }]
    result.path.map((el, i) => {
      let t_path = []
      el.path.map((item, j) => {
        if( j % 4 === 0){
          t_path.push( (item / 50))
        }else{
          t_path.push( item )
        }
      })
      path_czml.push({
        'id': 'path' + i,
        'name': 'path' + i,
        'availability': Cesium.JulianDate.addSeconds(now, totalTime, new Cesium.JulianDate()).toString() + '/' + Cesium.JulianDate.addSeconds(now, totalTime + t_path[t_path.length - 4] + 3, new Cesium.JulianDate()).toString(),
        'path': {
          'material': {
            'solidColor': {
              'color': {
                'rgba': el.color
              }
            }
          },
          'width': [{
            'number': 8.0
          }],
          'leadTime': 5
        },
        'position': {
          'interpolationAlgorithm': 'LAGRANGE',
          'interpolationDegree': 1,
          'epoch': Cesium.JulianDate.addSeconds(now, totalTime, new Cesium.JulianDate()).toString(),
          'cartographicDegrees': t_path
        }
      })
      totalTime += t_path[t_path.length - 4] + 1
    })
    let pathDS = new Cesium.CzmlDataSource()
    viewer.dataSources.add(pathDS)
    pathDS.process(path_czml).then(function () {
      setTimeout(function () {
        loadCars(result)
        pathDS.show = false
      }, (totalTime) * 1000)
    })
  })
}

function loadCars (result) {
  let totalTime = 0
  let sTime = Cesium.JulianDate.now() // Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), totalTime + 10, new Cesium.JulianDate())
  let car_czml = [{
    'id': 'document',
    'name': '应急车辆',
    'version': '1.0',
    'clock': {
      currentTime: sTime.toString(),
      multiplier: 1
    }
  }]
  result.path.map((el, i) => {
    car_czml.push({
      'id': 'car' + i,
      'name': 'car' + i,
      'availability': sTime.toString() + '/' + Cesium.JulianDate.addMinutes(sTime, 10, new Cesium.JulianDate()).toString(),
      'model': {
        'gltf': '/static/model/qiche.gltf'
      },
      'billboard': {
        'image': '/static/html/assets/img/traffic/tip_car_' + el.type + '.png',
        'scale': 0.7,
        'pixelOffset': {
          'cartesian2': [-10, -50]
        }
      },
      'label': {
        'text': el.duration + '',
        'font': '18px Lucida Console',
        'horizontalOrigin': 'LEFT',
        'verticalOrigin': 'TOP',
        'pixelOffset': {
          'cartesian2': [-70, -95]
        }
      },
      'orientation': {
        'velocityReference': '#position'
      },
      'path': {
        'material': {
          'polylineDash': {
            'color': {
              'rgba': el.color
            }
          }
        },
        'width': 8.0,
        'leadTime': 1000,
        'trailTime': 1
      },
      'position': {
        'interpolationAlgorithm': 'LAGRANGE',
        'interpolationDegree': 1,
        'epoch': sTime.toString(),
        'cartographicDegrees': el.path
      }
    })
    car_czml.push({
      'id': 'car_lable_' + i,
      'name': 'car_lable_' + i,
      'availability': sTime.toString() + '/' + Cesium.JulianDate.addMinutes(sTime, 10, new Cesium.JulianDate()).toString(),
      'label': {
        'text': el.label + '\n预计时间：' + el.duration + '\n经过红绿灯：' + el.trafficLight,
        'font': '10px Lucida Console',
        'horizontalOrigin': 'LEFT',
        'verticalOrigin': 'TOP',
        'pixelOffset': {
          'cartesian2': [-20, -110]
        }
      },
      'path': {
        'show': [{
          'boolean': false
        }]
      },
      'position': {
        'interpolationAlgorithm': 'LAGRANGE',
        'interpolationDegree': 1,
        'epoch': sTime.toString(),
        'cartographicDegrees': el.path
      }
    })
    totalTime += el.path[el.path.length - 4] + 1
  })
  let dataSource = new Cesium.CzmlDataSource()
  viewer.dataSources.add(dataSource)
  dataSource.process(car_czml)
}
