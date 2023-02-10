/**********************************
 * Description: by IntelliJ IDEA.
 * Author: diaolili
 * Date: 2019/3/6 20:17
 * Example:
 ***********************************/
let heatLayerProvider
let flowDS
let viewer
let path = GLOBAL_INTERFACE + '/aioc-api'
let initMap = function () {
  cs3d.createMap({
    id: 'cesiumContainer',
    data: {
      'center': { 'y': 36.651638, 'x': 116.967431, 'z': 15620.2, 'heading': 1.4, 'pitch': -25.4, 'roll': 0 },
      'minzoom': 20,
      'maxzoom': 20000000,
      'style': { 'atmosphere': true, 'lighting': false, 'fog': false, 'testTerrain': false },
      'controls': [
        { 'type': 'location' },
        { 'type': 'navigation', 'style': { 'top': '50px', 'right': '2px' } }
      ],
      'terrain': { 'visible': false },
      'crs': 'gcj',
      'infoBox': false,
      'navigationHelpButton': false,
      'fullscreenButton': false,
      'homeButton': false,
      'operationallayers': [],
      'basemaps': [{
        'type': 'group',
        'layers': [
          { 'name': '底图', 'type': 'www_tdt', 'layer': 'img_d' },
          { 'name': '注记', 'type': 'www_tdt', 'layer': 'img_z' }
        ],
        'visible': true
      }]
      // 'basemaps': 'mapbox',
      // 'imageryProvider': new Cesium.MapboxImageryProvider({ mapId: 'mapbox.dark' })
    },
    success: function (_viewer, gisdata, jsondata) { // 地图成功加载完成后执行
      viewer = _viewer
      viewer.scene.globe.depthTestAgainstTerrain = true
      removeMask()
      initWork()
      cqdk()
    }
  })
}
// 当前页面业务相关
let initWork = function () {
  // 禁掉以下几个选项，可以相对更加流畅
  viewer.targetFrameRate = 20 // 限制帧率0
  viewer.requestRenderMode = true // 取消实时渲染
  viewer.scene.fog.enable = false
  viewer.scene.skyAtmosphere.show = false
  viewer.scene.fxaa = false
  viewer.scene.requestRenderMode = true

  //getUserName()
  // viewer.scene.maximumRenderTimeChange = Infinity

  // 业务逻辑
  // loadModel();
  cs3d.util.createModel({
    name: '3dtiles',
    uri: './gltf/gwh.glb',
    x: 116.955084,
    y: 36.763332,
    z: 3,
    heading: 10,
    scale: 0.015
  }, viewer)
  cs3d.util.createModel({
    name: '3dtiles',
    uri: './gltf/bk01.gltf',
    x: 117.016526,
    y: 36.668927,
    z: 3,
    heading: -270,
    scale: 1
  }, viewer)
}

let removeMask = function () {
  $('#mask').remove()
}

// 热力图
let heatmap = function () {
  clear('heatmap')
  let arrPoint = []
  let min = 0
  let max = 0
  let minx = 0, maxx = 0, miny = 0, maxy = 0
  AsyncGetUrl(path + '/fp/list/null/1/null')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      data.cqRkBasicDtos.map(el => {
        arrPoint.push({'x': eval(el.pointx), 'y': eval(el.pointy), 'value': eval(el.value)})
        min = min < eval(el.value) ? min : eval(el.value)
        max = max > eval(el.value) ? max : eval(el.value)

        minx = minx < eval(el.pointx) ? minx : eval(el.pointx)
        maxx = maxx > eval(el.pointx) ? maxx : eval(el.pointx)

        miny = miny < eval(el.pointy) ? miny : eval(el.pointy)
        maxy = maxy > eval(el.pointy) ? maxy : eval(el.pointy)
      })
      let option = {
        bounds: { 'west': minx + 0.05, 'south': miny + 0.05, 'east': maxx + 0.05, 'north': maxy + 0.05 },
        heatmapoptions: {radius: 1, blur: 0.4},
        data: {
          'min': min,
          'max': max, // 热力值
          'points': arrPoint
        }
      }
      let heatLayer = createHeatmapImageryProvider(Cesium, option)
      heatLayerProvider = viewer.imageryLayers.addImageryProvider(heatLayer)
    })
}

// 产业流向
let productflow = function () {
  flow(path + '/fp/list/null/3/' + getStatusParameters())
}

// 人口流向
let pepleFlow = function () {
  flow(path + '/fp/list/null/2/' + getStatusParameters())
}
let flow = function (url) {
  var start = Cesium.JulianDate.fromDate(new Date(2018, 10, 15, 8))
  var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate()) // 设置总时长360秒

  viewer.clock.startTime = start.clone()
  viewer.clock.stopTime = stop.clone()
  viewer.clock.currentTime = start.clone()
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop at the end
  viewer.clock.multiplier = 10 // 倍速率播放

  flowDS = new Cesium.CustomDataSource()
  viewer.dataSources.add(flowDS)
  AsyncGetUrl(url)
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      data.fpProjectDtos.map(el => {
        let arry = (el.cqRkDtoqs ? el.cqRkDtoqs : el.cqIndustryDtos) || []
        let proj = {'projectName': el.name, 'planBeginTime': el.planBeginTime, 'planEndTime': el.planEndTime, 'beginTime': el.beginTime, 'endTime': el.endTime, 'zrPerson': el.zrPerson}
        let type = el.cqRkDtoqs ? 'rk' : 'cy'

        arry.map(item => {
          let fPoint = item.pkFromPoint ? item.pkFromPoint.split(',').map(el => eval(el)) : item.cyFromPoint.split(',').map(el => eval(el))
          let tPoint = item.pkToPoint ? item.pkToPoint.split(',').map(el => eval(el)) : item.cyToPoint.split(',').map(el => eval(el))
          let positions = timePositions(fPoint, tPoint)
          let ora = (fPoint[0] - tPoint[0]) <= 0 ? 'f' : 'b'
          let imgUri = getImgUri(type, ora)

          let entity = flowDS.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
              start: start,
              stop: stop
            })]),
            position: positions,
            billboard: {
              image: imgUri,
              // image:'../assets/img/bar.png',
              color: new Cesium.Color(...getColor(el.status)).withAlpha(1),
              pixelOffset: new Cesium.Cartesian2(0, -5)
            },
            path: {
              material: new Cesium.DashArrowMaterialProperty({
                startColor: new Cesium.Color(...getStartColor(el.status)),
                stopColor: new Cesium.Color(...getColor(el.status)).withAlpha(1)
              }),
              width: 10
            }
          })

          if (type === 'rk') {
            bindPopup(entity, proj, item, null)
          } else if (type === 'cy') {
            bindPopup(entity, proj, null, item)
          }
        })
      })
    })
}

// 弹出
let bindPopup = function (entity, proj, rkObj, cyObj) {
  let inthtml = '<div class="project_pop"><h2>' + proj.projectName + '</h2>'

  inthtml += '<div class="step"><div class="qc_l"><span>迁出地</span>' + (rkObj ? rkObj.fromName : cyObj.fromName) + '</div><div class="pro_m"></div><div class="qr_l"><span>迁入地</span>' + (rkObj ? rkObj.toName : cyObj.toName) + '</div></div>'

  inthtml += '<ul><li>开始时间：' + proj.beginTime + '</li><li>完成时间：' + proj.endTime + '</li>'

  if (rkObj) {
    inthtml += '<li>涉及人口：' + rkObj.sjRk + '人</li><li>其中贫困人口：' + rkObj.pkRk + '人</li><li>贫困人口负责人：' + rkObj.pkRkZperson + '</li><li>贫困人口迁移完成：' + rkObj.pkZkIsFinish + '</li>'
  }
  if (cyObj) {
    inthtml += '<li>产业类型：' + cyObj.cyType + '人</li><li>产业负责人：' + cyObj.cyZpenson + '</li><li>涉及产业规模：' + cyObj.cyScale + '万元</li><li>是否涉及拆迁：' + cyObj.isCaiqian + '</li>'
  }

  inthtml += '</ul><div class="triangle"></div></div>'
  entity.popup = {
    html: inthtml,
    anchor: [0, -12]// 左右、上下的偏移像素值。
  }
}

// 清除
let clear = function (type) {
  if (!type || type === 'heatmap') {
    viewer.imageryLayers.remove(heatLayerProvider)
    heatLayerProvider = null
  }
  if (!type || type === 'flow') {
    let destroy = viewer.dataSources.remove(flowDS)
    flowDS = null
  }
}

let getViewer = function () {
  return viewer
}

// 用户信息
let getUserName = function () {
  AsyncGetUrl(GLOBAL_INTERFACE + '/aioc-api/user/info')
    .then(function (value) {
      let data = eval('(' + value + ')')
      if (data.code == 200) {
        $('.user_name span').text(data.data.name)
      }
    })
}

// 搜索参数
let search = function (url) {
  let status = {'未拆迁': 'wcq', '拆迁中': 'cqz', '拆迁完成': 'cqwc', '已入驻': 'yrz', '企业意向': 'qyyx'}
  AsyncGetUrl(path + '/fp/list/' + url)
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      $('.list_main ul').empty()
      if (data.fpProjectDtos && data.fpProjectDtos.length > 0) {
        data.fpProjectDtos.map(el => {
          let $li = $('<li><span>' + el.name + '</span><span><i class="' + status[el.status] + '"></i>' + el.status + '</span></li>').data('dkxx', el)
          $('.list_main ul').append($li)
        })
      }
      if (data.cqParcelInfoDtos && data.cqParcelInfoDtos.length > 0) {
        data.cqParcelInfoDtos.map(el => {
          let $li = $('<li><span>' + el.name + '</span><span><i class="' + status[el.status] + '"></i>' + el.status + '</span></li>').data('dkxx', el)
          $('.list_main ul').append($li)
        })
      }

      $('.search_result li').bind('click', function () {
        var data = $(this).data('dkxx')
        if (data) {
          for (var el in data) {
            $('#projPop .' + el).text(data[el])
          }
          $('#projPop').show()
        }
      })
    })
}

// 搜索状态
let getStatusParameters = function () {
  let str = ''
  if ($('.fpStatus .icon_fxxz').size() > 0) {
    $('.fpStatus .icon_fxxz').each(function () {
      str += $(this).parent().text().trim() + ','
    })
  } else {
    str += 'null,'
  }
  return str.substr(0, str.length - 1)
}

// 拆迁地块
let cqdk = function () {
  AsyncGetUrl(path + '/fp/list/null/4/null')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      if (data.cqParcelInfoDtos && data.cqParcelInfoDtos.length > 0) {
        let arry = []
        data.cqParcelInfoDtos.map(el => {
          let points = el.points.split(',').map(p => eval(p))
          let color = getColor(el.type)
          if (points.length != 0 && points.length % 2 == 0) {
            let polygon = new Cesium.PolygonGeometry({
              height: 1,
              polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(points)
              )
            })
            let polygonInstance = new Cesium.GeometryInstance({
              geometry: polygon,
              id: el.landid + '',
              attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(color[0], color[1], color[2], color[3]
                )
              }
            })
            arry.push(polygonInstance)
          }
        })
        let landPrimitive = new Cesium.Primitive({
          geometryInstances: arry,
          appearance: new Cesium.PerInstanceColorAppearance({ flat: true })
        })
        // appearance: new Cesium.PerInstanceColorAppearance({ flat: true ,translucent : false})
        viewer.scene.primitives.add(landPrimitive)
      }
    })
}

// 地块状态颜色
function getColor (status) {
  switch (status) {
    case 'YD-R2':
      return [ 255 / 255.0, 255 / 255.0, 102 / 255.0, 0.64]// YD-R2
    case 'YD-A33':
      return [ 255 / 255.0, 118 / 255.0, 0 / 255.0, 0.64]// YD-A33
    case 'YD-A1':
      return [ 255 / 255.0, 0 / 255.0, 255 / 255.0, 0.64]// YD-A1
    case 'YD-A3':
      return [ 255 / 255.0, 115 / 255.0, 255 / 255.0, 0.64]// YD-A3
    case 'YD-A2':
      return [ 255 / 255.0, 154 / 255.0, 119 / 255.0, 0.64]// YD-A2
    case 'YD-B1':
      return [ 255 / 255.0, 0 / 255.0, 53 / 255.0, 0.64]// YD-B1
    case 'YD-M1':
      return [ 127 / 255.0, 159 / 255.0, 255 / 255.0, 0.64]// YD-M1
    case 'YD-M2':
      return [ 127 / 255.0, 127 / 255.0, 255 / 255.0, 0.64]// YD-M2
    case 'YD-W1':
      return [ 159 / 255.0, 127 / 255.0, 255 / 255.0, 0.64]// YD-W1
    case 'YD-G1':
      return [ 0 / 255.0, 153 / 255.0, 0 / 255.0, 0.64]// YD-G1
    case 'YD-U':
      return [ 0 / 255.0, 114 / 255.0, 153 / 255.0, 0.64]// YD-U
    case 'YD-E22':
      return [ 0 / 255.0, 104 / 255.0, 153 / 255.0, 0.64]// YD-E22
    case 'YD-E21':
      return [ 0 / 255.0, 255 / 255.0, 127 / 255.0, 0.64]// YD-E21
    case 'YD-E2':
      return [ 231 / 255.0, 255 / 255.0, 217 / 255.0, 0.64]// YD-E2
    case 'YD-15':
      return [ 231 / 255.0, 255 / 255.0, 217 / 255.0, 0.64]// YD-15
    case 'YD-H14':
      return [ 178 / 255.0, 204 / 255.0, 102 / 255.0, 0.64]// YD-H14
    case 'YD-E11':
      return [ 0 / 255.0, 127 / 255.0, 255 / 255.0, 0.64]// YD-E11
    case 'YD-E12':
      return [ 0 / 255.0, 191 / 255.0, 255 / 255.0, 0.64]// YD-E12
    case 'YD-E13':
      return [ 127 / 255.0, 223 / 255.0, 255 / 255.0, 0.64]// YD-E13
    case '未拆迁':
      return [236 / 255.0, 70 / 255.0, 56 / 255.0, 0.64]
    case '拆迁中':
      return [236 / 255.0, 183 / 255.0, 56 / 255.0, 0.64]
    case '拆迁完成':
      return [67.0 / 255.0, 97.0 / 255.0, 255.0 / 255.0, 0.64]
    case '企业意向':
      return [236 / 255.0, 56 / 255.0, 224 / 255.0, 0.64]
    case '已入驻':
      return [0.0, 1.0, 245.0 / 255.0, 0.64]
  }
  return [255 / 255.0, 255 / 255.0, 255 / 255.0, 0.64]
}
// 飞线起点颜色
let getStartColor = function (status) {
  switch (status) {
    case '未拆迁':
      return [223 / 255.0, 161 / 255.0, 0 / 255.0, 1]
    case '拆迁中':
      return [223 / 255.0, 161 / 255.0, 0 / 255.0, 1]
    case '拆迁完成':
      return [81 / 255.0, 151 / 255.0, 247 / 255.0, 1]
    case '企业意向':
      return [255 / 255.0, 171 / 255.0, 0 / 255.0, 1]
    case '已入驻':
      return [0.0, 1.0, 245.0 / 255.0, 1]
  }
  return [236 / 255.0, 70 / 255.0, 56 / 255.0, 1]
}

// 飞线图标
let getImgUri = function (type, ora) {
  let prefix = './assets/img/'
  return prefix + 'fp' + type + '_' + ora + '.png'
}

// 飞线时间
let timePositions = function (fPoint, tPoint) {
  let arry = Cesium.getLinkedPointList(Cesium.Cartesian3.fromDegrees(...fPoint), Cesium.Cartesian3.fromDegrees(...tPoint), 10000, 11)
  var property = new Cesium.SampledPositionProperty()
  for (var i = 0, len = arry.length; i < len; i++) {
    Cesium.Math.toRadians(i)
    var time = Cesium.JulianDate.addSeconds(Cesium.JulianDate.fromDate(new Date(2018, 10, 15, 8)), i * 36, new Cesium.JulianDate()) //
    // 添加每一个链接点的信息，到达的时间以及坐标位置
    property.addSample(time, arry[i])
  }
  return property
}

/**
 * 异步URL请求（GET）
 * @param url
 * @returns {Promise}
 * @constructor
 */
let AsyncGetUrl = function (url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.withCredentials = true // 支持跨域发送cookies

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(this.responseText, this)
        } else {
          var resJson = { code: this.status, response: this.response }
          reject(resJson, this)
        }
      }
    }
    xhr.send()
  })
}

export default {
  initMap,
  heatmap,
  productflow,
  pepleFlow,
  getViewer,
  search,
  getStatusParameters,
  clear
}
