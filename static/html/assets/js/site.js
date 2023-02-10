var path = GLOBAL_INTERFACE + '/aioc-api/'

var viewer
var landList = []
var areaList = []
var intersectLandList = [] // 相交地块
var intersectAreaList = [] // 相交区域
var numberOfpage = 5// 搜索view最大页数
var pickType = 0 // 1为画多边形 0 为默认
var popupObj = null
var statusSataSource = null
var layerindex
var groundPrimitive
// var linePrimitive;
// 画对变形
var activeShapePoints = []
var activeShape
var startDraw = false
var currentDrawPick
var drawEntityList = [] // 自己hua
var totalPage = 0
var viewModel = {
  totalPage: [],
  searchCurrnetPage: 0,
  intersectList: [], // 记录检测到的有冲突的地块
  projectList: [], // 项目信息
  value: '',
  projectName: '',
  areaName: '',
  areaPoints: '',
  company: '',
  area: '', // 面积
  areaString: '',
  type: '',
  land: {} // 地块信息
  // searchList: [] //搜索类别
}
Cesium.knockout.track(viewModel)
Cesium.knockout.applyBindings(viewModel)
Cesium.knockout.getObservable(viewModel, 'value').subscribe(function (newValue) {
  if (newValue) {
    for (var i = 0; i < viewModel.projectList.length; i++) {
      if (viewModel.projectList[i].id === newValue) {
        viewModel.company = viewModel.projectList[i].companyname
        viewModel.projectName = viewModel.projectList[i].name
        break
      }
    }
  } else {
    viewModel.company = ''
    viewModel.projectName = ''
  }
})

function addListenEvent () {
  $('.quit').click(function () {
    delCookie('gunsToken')
    goToLogin()
  })
  $('.user_name').click(function () {
    if ($('.quit').css('display') == 'none') {
      $('.user').addClass('user_bg')
      $('.quit').css('display', 'block')
    } else {
      $('.user').removeClass('user_bg')
      $('.quit').css('display', 'none')
    }
  })

  $('.nav_btn').click(function () {
    $('.nav_mask').addClass('show')
    setTimeout(function () {
      $('.nav_mask').css('opacity', '1')
    }, 100)
  })
  $('.nav_close_btn').click(function () {
    $('.nav_mask').css('opacity', '0')
    setTimeout(function () {
      $('.nav_mask').removeClass('show')
    }, 500)
  })

  $('#okClick').click(function () {
    if (currentDrawPick.obj.draw) {
      AddAreaAPI()
    } else {
      updateAreaAPI()
    }
  })

  $('#cancelClick').click(function () {
    layer.close(layerindex)
    closePopup()
  })

  $('#reset').click(function () {
    viewModel.value = undefined
    viewModel.projectName = ''
    viewModel.areaName = ''
  })
  $('#submit').click(function () {
    // 判读为空
    if (!viewModel.value || !viewModel.projectName || !viewModel.areaName) {
      layer.msg('项目或区域名称不能为空')
      debugger
      return
    }
    var tmp = '是否确认将"目标区域"的意向企业变更为"' + viewModel.company + '"?'
    $('.confirm_pop p span').text(tmp)
    layerindex = layer.open({
      type: 1,
      closeBtn: 0,
      shadeClose: true,
      title: '',
      area: ['320px', '184px'], // 宽高
      content: $('.confirm_pop')
    })
  })

  $('#draw').bind('click', function () {
    if (pickType == 0) {
      $('#draw span').text('结束选址')
      pickType = 1
    } else if (pickType == 1) {
      // 清空
      clearDrawStatus()
    }
  })

  $('#clearDraw').click(function () {
    clearDrawArea()
    closePopup()
  })

  $('#searchContent span').click(function () {
    searchCurrnetPage = 0
    search()
  })
  $('#searchContent input').bind('keypress', function (event) {
    if (event.keyCode == '13') {
      // 调用接口param
      searchCurrnetPage = 0
      search()
    }
  })
}
$(document).ready(function () {
  var whdef = 100 / 1080// 表示1920的设计图,使用100PX的默认值
  var wH = window.innerHeight// 当前窗口的高度
  var wW = window.innerWidth// 当前窗口的宽度
  var rem = wH * whdef// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  $('html').css('font-size', rem + 'px')
  addListenEvent()
  if (!cs3d.util.webglreport()) {
    alert('系统检测到您使用的浏览器不支持WebGL功能')
    layer.open({
      type: 1,
      title: '当前浏览器不支持WebGL功能',
      closeBtn: 0,
      shadeClose: false,
      resize: false,
      area: ['600px', '200px'], // 宽高
      content:
        '<div style="margin: 20px;"><h3>系统检测到您使用的浏览器不支持WebGL功能！</h3>  <p>1、请您检查浏览器版本，安装使用最新版chrome、火狐或IE11以上浏览器！</p> <p>2、WebGL支持取决于GPU支持，请保证客户端电脑已安装显卡驱动程序！</p></div>'
    })
  }
  initMap()
})

function areaListAPI () {
  getRequest(
    path + 'siteSelection/getAreaList',
    function (success, data) {
      if (success) {
        var area = data.map(item => {
          item.landid = 'area-' + item.id
          item.positions = item.points.split(',')
          item.color = getColor(item.status)
          item.areaString = item.area + '亩'
          item.statusContent = item.status
          return item
        })
        areaList = area
      }
    }
  )
}

function AddAreaAPI () {
  // currentDrawPick
  var projectID = viewModel.value
  var company = viewModel.company
  var projectName = viewModel.projectName
  var area = viewModel.area
  var areaName = viewModel.areaName
  var landIDS = []
  for (var i = 0; i < intersectLandList.length; i++) {
    landIDS.push(intersectLandList[i].id)
  }
  var areaPoints = viewModel.areaPoints
  var pam = {
    name: areaName,
    projectId: projectID,
    projectName: projectName,
    area: area,
    enterpriseName: company,
    points: areaPoints,
    parcelIds: landIDS
  }
  postRequest(
    path + 'siteSelection/addArea',
    pam,
    function (success, data) {
      if (success) {
        var item = {}
        item.id = data
        item.name = areaName
        item.projectId = projectID
        item.projectName = projectName
        item.area = area
        item.enterpriseName = company
        item.points = areaPoints
        item.status = '企业意向'
        item.landid = 'area-' + item.id
        item.positions = areaPoints.split(',')
        item.color = getColor(item.status)
        item.areaString = item.area + '亩'
        item.statusContent = item.status
        areaList.push(item)
        var obj = polygonObj(item, false)
        obj.intersectList = intersectLandList
        currentDrawPick.obj = obj
        layer.close(layerindex)
        closePopup()
        layer.msg('添加成功')
      }
    }
  )
}

function updateAreaAPI () {
  var projectID = viewModel.value
  var company = viewModel.company
  var projectName = viewModel.projectName
  var areaName = viewModel.areaName

  var pam = {
    id: currentDrawPick.obj.id,
    name: areaName,
    projectId: projectID,
    projectName: projectName,
    enterpriseName: company
  }
  postRequest(
    path + 'siteSelection/updateArea',
    pam,
    function (success, data) {
      if (success) {
        var obj = currentDrawPick.obj
        for (var i = 0; i < areaList.length; i++) {
          var item = areaList[i]
          if (item.id == obj.id) {
            item.name = areaName
            item.projectId = projectID
            item.projectName = projectName
            item.enterpriseName = company
            item.landid = 'area-' + item.id
            item.areaString = item.area + '亩'
            item.statusContent = item.status
            obj.company = item.enterpriseName
            obj.projectName = item.projectName
            obj.projectId = item.projectId
            obj.areaName = item.name
            break
          }
        }
        layer.close(layerindex)
        closePopup()
        layer.msg('修改成功')
      }
    }
  )
}

function getAreaEixsted (id) {
  for (var i = 0; i < drawEntityList.length; i++) {
    var item = drawEntityList[i]
    if (id == item.obj.id) {
      return item
    }
  }
  return null
  // 从数组中删除
}
function isAreaEixsted (id) {
  for (var i = 0; i < drawEntityList.length; i++) {
    var item = drawEntityList[i]
    if (id == item.obj.id) {
      return true
    }
  }
  return false
}

function postRequest (url, param, callback) {
  $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    data: JSON.stringify(param),
    success: function (data) {
      callback(true, data)
    },
    error: function (e) {
      callback(false, null)
    }
  })
}
function getRequest (url, callback) {
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    success: function (data) {
      callback(true, data)
    },
    error: function (e) {
      callback(false, null)
    }
  })
}

function pageTextChange (isPre) {
  if (totalPage > numberOfpage) {
    if (isPre) {
      if ((searchCurrnetPage + 1) % numberOfpage == 0) {
        var page = (searchCurrnetPage + 1) / (numberOfpage)
        var template = '<p><span id = "previous"> < </span>'
        for (var i = (page - 1) * numberOfpage + 1; i < totalPage + 1; i++) {
          if (i > (page - 1) * numberOfpage + numberOfpage) {
            break
          }
          if (i == (page - 1) * numberOfpage + numberOfpage) {
            template += '<i class="on">' + i + '</i>'
          } else {
            template += '<i>' + i + '</i>'
          }
        }
        template += '<span id = "next"> > </span></p>'
        $('.page').html(template)
        listenPageChanged()
      }
    } else {
      if (searchCurrnetPage % numberOfpage == 0) {
        var page = searchCurrnetPage / numberOfpage
        var template = '<p><span id = "previous"> < </span>'
        for (var i = page * numberOfpage + 1; i < totalPage + 1; i++) {
          if (i > page * numberOfpage + numberOfpage) {
            break
          }
          if (i == page * numberOfpage + 1) {
            template += '<i class="on">' + i + '</i>'
          } else {
            template += '<i>' + i + '</i>'
          }
        }
        template += '<span id = "next"> > </span></p>'
        $('.page').html(template)
        listenPageChanged()
      }
    }
  }
}

function listenPageChanged () {
  $('.page i').unbind()
  $('.page span').unbind()
  $('.page i').click(function () {
    var index = $(this).text()
    $('.page i').removeClass('on')
    $(this).addClass('on')
    searchCurrnetPage = parseInt(index) - 1
    search()
  })

  $('#next').click(function () {
    searchCurrnetPage++
    // console.log('searchCurrnetPage:' + searchCurrnetPage + '-->totalPage:' + totalPage)
    if (searchCurrnetPage >= totalPage - 1) {
      searchCurrnetPage = totalPage - 1
    }
    $('.page i').removeClass('on')
    $('.page i').each(function () {
      if ($(this).text() == searchCurrnetPage + 1) {
        $(this).addClass('on')
      }
    })
    pageTextChange(false)

    search()
  })
  $('#previous').click(function () {
    searchCurrnetPage--
    if (searchCurrnetPage <= 0) {
      searchCurrnetPage = 0
    }

    $('.page i').removeClass('on')
    $('.page i').each(function () {
      if ($(this).text() == searchCurrnetPage + 1) {
        $(this).addClass('on')
      }
    })
    pageTextChange(true)

    search()
  })
}
function searchAPI (page, callback) {
  let content = $('#searchContent input').val()
  getRequest(
    path + 'siteSelection/searchParcelAndArea?param=' +
      content +
      '&pageNum=' +
      page,
    function (success, data) {
      if (success) {
        if (searchCurrnetPage == 0) {
          totalPage = parseInt(data.totalPage)
          if (totalPage != 0) {
            var template = '<p><span id = "previous"> < </span>'
            for (var i = 1; i < totalPage + 1; i++) {
              if (i > numberOfpage) {
                break
              }
              if (i == 1) {
                template += '<i class="on">' + i + '</i>'
              } else {
                template += '<i>' + i + '</i>'
              }
            }
            template += '<span id = "next"> > </span></p>'
            $('.page').html(template)

            listenPageChanged()
          }
        }

        var parcelList = data.parcelList || []
        var parce = parcelList.map(item => {
          return landinfoHandle(item)
        })
        var areaList = data.areaList || []
        var area = areaList.map(item => {
          item.landid = 'area-' + item.id
          item.positions = item.points.split(',')
          item.color = getColor(item.status)
          item.areaString = item.area + '亩'
          item.statusContent = item.status
          item.typeString = item.typeString
          return item
        })
        var tmp = area.concat(parce)
        callback(true, tmp)
      } else {
        callback(false, null)
      }
    }
  )
}
// 根据搜索id返回地块信息
function getPopupContent (id) {
  for (var i = 0; i < landList.length; i++) {
    if (landList[i].landid === id) {
      return landList[i]
    }
  }
  return null
}

function getClass (status) {
  switch (status) {
    case '未拆迁':
      return 'wcq'
    case '拆迁中':
      return 'cqz'
    case '拆迁完成':
      return 'cqwc'
    case '企业意向':
      return 'qyyx'
    case '已入驻':
      return 'yrz'
  }

  return ''
}

function search () {
  // console.log(searchCurrnetPage)
  searchAPI(searchCurrnetPage, function (success, data) {
    if (success) {
      // viewModel.searchList = data;
      var template = ''
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        var tmp =
          '<li><span>' +
          item.name +
          '</span><span><i class="' +
          getClass(item.status) +
          '"></i>' +
          item.status +
          '</span></li>'
        template += tmp
      }
      $('.list_main ul').html(template)
      $('.list_main li').bind('click', function () {
        closePopup()
        clearDrawArea()
        var index = $(this).index()
        var item = data[index]
        if (item.landid.indexOf('land') != -1) {
          var content = getPopupContent(item.landid)
          var center = centerOfPolygon(item.positions)
          if (center == null) {
            return
          }
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              center[0],
              center[1],
              5000
            ),
            complete: function () {
              var cartographic = Cesium.Cartesian3.fromDegrees(
                center[0],
                center[1],
                0
              )
              setPopupContent(cartographic, content)
            }
          })
        } else if (item.landid.indexOf('area') != -1) {
          var index = $(this).index()
          var item = data[index]
          //
          if (isAreaEixsted(item.id)) {
            var center = centerOfPolygon(item.positions)
            if (center == null) {
              return
            }
            // 改变颜色
            var entityObj = getAreaEixsted(item.id)
            var entityId = entityObj.id
            var entity = statusSataSource.entities.getById(entityId)
            entity.polygon.material = new Cesium.Color(236 / 255.0, 56 / 255.0, 224 / 255.0, 0.6)
            entity.polygon.outlineColor = new Cesium.Color(255 / 255.0, 0, 117 / 255.0, 1)

            intersectLandList = entityObj.obj.intersectList
            viewModel.area = item.area
            viewModel.areaString = '约' + item.area + '亩'
            viewModel.value = item.projectId
            viewModel.projectName = item.projectName
            viewModel.areaName = item.name
            viewModel.company = item.enterpriseName

            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                center[0],
                center[1],
                5000
              ),
              complete: function () {
                drawEntityList.push(entityObj)
                currentDrawPick = entityObj
                showIntersectView()
                $('.pickPolygon').show()
              }
            })
          } else {
            var lineColor = new Cesium.Color(255 / 255.0, 0, 117 / 255.0, 1)
            var color = new Cesium.Color(236 / 255.0, 56 / 255.0, 224 / 255.0, 0.6)
            var entityObj = drawPolygon(item, lineColor, color)
            var obj = polygonObj(item, false)
            entityObj.obj = obj
            viewModel.area = item.area
            viewModel.areaString = '约' + item.area + '亩'
            viewModel.value = item.projectId
            viewModel.projectName = item.projectName
            viewModel.areaName = item.name
            viewModel.company = item.enterpriseName
            drawEntityList.push(entityObj)
            currentDrawPick = entityObj
            getIntersectArea(item.id, entityObj.obj, function (success, data) {
              if (success) {
                showIntersectView()
                // viewModel.intersectList = data;
                var center = centerOfPolygon(item.positions)
                if (center == null) {
                  return
                }
                viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(
                    center[0],
                    center[1],
                    5000
                  ),
                  complete: function () {
                    $('.pickPolygon').show()
                  }
                })
              }
            })
          }
        }
      })
    }
  })
}

function getCoordinateFromArr (positions) {
  if (positions.length < 2) {
    return null
  }
  if (positions.length % 2 != 0) {
    return [parseFloat(positions[0]), parseFloat(positions[1]), 0]
  }
  var arr = []
  for (var i = 0; i < positions.length; i += 2) {
    arr.push([parseFloat(positions[i]), parseFloat(positions[i + 1]), 0])
  }
  arr.push([parseFloat(positions[0]), parseFloat(positions[1]), 0])
  return arr
}

function centerOfPolygon (positions) {
  var arr = getCoordinateFromArr(positions)
  var tmp = [arr]
  // tmp.push(arr)
  var polygon = turf.polygon(tmp)
  var center = turf.centerOfMass(polygon)
  return center.geometry.coordinates
}

function removeMask () {
  $('#mask').remove()
}

// 初始化地图
function initMap () {
  cs3d.createMap({
    id: 'cesiumContainer',
    data: {
      center: {
        y: 35.408226,
        x: 117.010959,
        z: 100.2,
        heading: 1.4,
        pitch: 0,
        roll: 0
      },
      minzoom: 20,
      maxzoom: 20000000,
      style: {
        atmosphere: true,
        lighting: true,
        fog: false,
        testTerrain: false
      },
      controls: [
        { type: 'location' },
        { type: 'navigation', style: { top: '50px', right: '2px' } }
      ],
      terrain: { visible: false },
      crs: 'gcj',
      operationallayers: [],
      // basemaps: 'mapbox',
      // imageryProvider: new Cesium.MapboxImageryProvider({
      //   mapId: 'mapbox.dark'
      // }),
      'basemaps': [{
        'type': 'group',
        'layers': [
          { 'name': '底图', 'type': 'www_tdt', 'layer': 'img_d' },
          { 'name': '注记', 'type': 'www_tdt', 'layer': 'img_z' }
        ],
        'visible': true
      }],
      homeButton: false,
      fullscreenButton: false,
      navigationHelpButton: false
    },
    success: function (_viewer, gisdata, jsondata) {
      // 地图成功加载完成后执行
      viewer = _viewer
      setTimeout(removeMask, 3000)
      initWork()
      cs3d.jdWidget.init(_viewer)
      cs3d.widget.init(_viewer)
    }
  })
}

// 用地类型
function getAreaType (type) {
  switch (type) {
    case 'YD-R2':
      return '居住综合用地'// YD-R2
    case '1':
      return ''// YD-A33
    case 'YD-A1':
      return '行政办公用地'// YD-A1
    case 'YD-A3':
      return '科创文教用地'// YD-A3
    case '4':
      return ''// YD-A2
    case 'YD-B1':
      return '商业商务用地'// YD-B1
    case 'YD-M1':
      return '高新产业用地'// YD-M1
    case 'YD-M2':
      return '先进制造用地'// YD-M2
    case 'YD-W1':
      return '物流仓储用地'// YD-W1
    case 'YD-G1':
      return '城市公共用地'// YD-G1
    case '10':
      return ''// YD-U
    case '11':
      return ''// YD-E22
    case '12':
      return ''// YD-E21
    case '13':
      return ''// YD-E2
    case '14':
      return ''// YD-15
    case '15':
      return ''// YD-H14
    case '16':
      return ''// YD-E11
    case '17':
      return ''// YD-E12
    case '18':
      return ''// YD-E13
  }
  return ''
}
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
    case '7G1-H':
    case '7G2':
    case '7G2-H':
    case '9E6-H':
      return [ 0 / 255.0, 153 / 255.0, 0 / 255.0, 0.64]
    case '2M1-1':
    case '2M2-1':
    case '2M3-H':
      return [ 131 / 255.0, 62 / 255.0, 0 / 255.0, 0.64]
    case '0R2-H':
      return [ 251 / 255.0, 255 / 255.0, 120 / 255.0, 0.64]
    case '1C2-H':
    case '1C3-H':
      return [ 245 / 255.0, 61 / 255.0, 0 / 255.0, 0.64]
    case '3W1-H':
      return [ 201 / 255.0, 129 / 255.0, 255/ 255.0, 0.64]
    case '4T4-H':
      return [ 101 / 255.0, 104 / 255.0, 97/ 255.0, 0.64]
    case '9E6-H':
      return [ 123 / 255.0, 255 / 255.0, 252 / 255.0, 0.64]
    case '未拆迁':
      return [236 / 255.0, 70 / 255.0, 56 / 255.0, 0.2]
    case '拆迁中':
      return [236 / 255.0, 183 / 255.0, 56 / 255.0, 0.2]
    case '拆迁完成':
      return [67.0 / 255.0, 97.0 / 255.0, 255.0 / 255.0, 0.2]
    case '企业意向':
      return [236 / 255.0, 56 / 255.0, 224 / 255.0, 0.2]
    case '已入驻':
      return [0.0, 1.0, 245.0 / 255.0, 0.2]
  }
  return [255 / 255.0, 255 / 255.0, 255 / 255.0, 0]
}
function getStatusContent (status) {
  switch (status) {
    case '1':
      return '未拆迁'
    case '2':
      return '拆迁中'
    case '3':
      return '拆迁完成'
    case '4':
      return '企业意向'
    case '5':
      return '已入驻'
  }
}
function createLineInstance () {
  var arr = []
  landList.map(item => {
    if (item.positions.length != 0 && item.positions.length % 2 == 0) {
      var polygon = new Cesium.GroundPolylineGeometry({
        width: 1,
        positions: Cesium.Cartesian3.fromDegreesArray(item.positions)
      })
      var polygonInstance = new Cesium.GeometryInstance({
        geometry: polygon,
        id: item.landid + '-line',
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(
            item.color[0],
            item.color[1],
            item.color[2],
            1
          )
        }
      })
      arr.push(polygonInstance)
    }
  })

  return arr
}

function createLandInstance () {
  var arr = []
  landList.map(item => {
    if (item.positions.length != 0 && item.positions.length % 2 == 0) {
      var polygon = new Cesium.PolygonGeometry({
        height: 1,
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(item.positions)
        )
      })
      var polygonInstance = new Cesium.GeometryInstance({
        geometry: polygon,
        id: item.landid + '',
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(
            item.color[0],
            item.color[1],
            item.color[2],
            item.color[3]
          )
        }
      })
      arr.push(polygonInstance)
    }
  })

  return arr
}

function getUserInfoAPI () {
  getRequest(path + '/user/info', function (success, data) {
    if (success) {
      if (data) {
        var usrname = (data.data && data.data.name) || ''
        $('.headerbg .user_name span').text(usrname)
      }
    }
  })
}

function projectAPI () {
  getRequest(
    path + 'siteSelection/getProjectList',
    function (success, data) {
      if (success) {
        viewModel.projectList = data || []
      }
    }
  )
}
function landinfoHandle (item) {
  item.status = (item.status && item.status != 'null') ? item.status : '未拆迁'
  // item.name = item.type;
  item.landid = 'land-' + item.id
  item.positions = item.points.split(',')
  item.color = getColor(item.type)
  item.areaString = '面积：约' + item.area + '亩'
  item.statusContent = '当前状态：' + ((item.status && item.status != 'null') ? item.status : '-')
  var company = item.enterpriseName || ''
  item.enterpriseNameString = '企业:' + company
  item.type = getAreaType(item.type)
  return item
}

function getLandData (callback) {
  getRequest(
    path + 'siteSelection/getParcelList',
    function (success, data) {
      if (success) {
        var arr = data.map(item => {
          return landinfoHandle(item)
        })
        callback(true, arr)
      } else {
        callback(false, null)
      }
    }
  )
}

function getCurrentMousePosition (scene, position, noPickEntity) {
  var cartesian
  // 在模型上提取坐标
  var pickedObject = scene.pick(position)
  if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
    // pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制
    var entity = pickedObject.id
    if (noPickEntity == null || (noPickEntity && entity !== noPickEntity)) {
      var cartesian = viewer.scene.pickPosition(position)
      if (Cesium.defined(cartesian)) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        var height = cartographic.height // 模型高度
        if (height >= 0) return cartesian
        // 不是entity时，支持3dtiles地下
        if (!Cesium.defined(pickedObject.id) && height >= -500) { return cartesian }
      }
    }
  }
  // 提取鼠标点的地理坐标
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
    // 三维模式下
    var pickRay = scene.camera.getPickRay(position)
    cartesian = scene.globe.pick(pickRay, scene)
  } else {
    // 二维模式下
    cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid)
  }
  return cartesian
}

function getIntersectArea (areaID, entityObj, callback) {
  getRequest(
    path + 'siteSelection/getParcelListForArea?areaId=' +
      areaID,
    function (success, data) {
      if (success) {
        entityObj.intersectList = data
        var arr = data.map(item => {
          return landinfoHandle(item)
        })
        callback(true, arr)
      } else {
        callback(false, null)
      }
    }
  )
}

function showIntersectView () {
  var template = ''
  for (var i = 0; i < intersectLandList.length; i++) {
    var item = intersectLandList[i]
    var active = ''
    if (item.status == '企业意向' || item.status == '已入驻') {
      active = 'active'
    }
    var tmp =
      '\
    <dl class="' +
      active +
      '">\
    <dt><i class="iconfont iconicon-diqu"></i>' +
      item.type +
      '</dt>\
    <dd>\
        <span><i>用地类型</i>' +
      item.type +
      '</span>\
        <span><i>面积</i>' +
      item.areaString +
      '</span>\
        <span><i>当前状态</i><b class="' + getClass(item.status) + '"></b>' +
      item.status +
      '</span>\
    </dd>\
</dl>'
    template += tmp
  }
  for (var i = 0; i < intersectAreaList.length; i++) {
    var item = intersectAreaList[i]
    var active = ''
    if (item.status == '企业意向' || item.status == '已入驻') {
      active = 'active'
    }
    var tmp =
      '\
    <dl class="' +
      active +
      '">\
    <dt><i class="iconfont iconicon-diqu"></i>' +
      item.name +
      '</dt>\
    <dd>\
        <span><i>意向企业</i>' +
      item.enterpriseName +
      '</span>\
        <span><i>面积</i>' +
      item.areaString +
      '</span>\
        <span><i>当前状态</i><b class="' + getClass(item.status) + '"></b>' +
      item.status +
      '</span>\
    </dd>\
</dl>'
    template += tmp
  }
  if (!template) {
    template = "<div style='margin-top:20px;text-align:center'>无数据<div>"
  }
  $('.details_list .dk_list').html(template)
}

function polygonObj (item, isDraw) {
  var obj = {}
  obj.draw = isDraw
  obj.area = item.area
  obj.company = item.enterpriseName
  obj.id = item.id
  obj.projectName = item.projectName
  obj.points = item.points
  obj.projectId = item.projectId
  obj.areaName = item.name

  return obj
}
function drawPolygon (item, lineColor, color) {
  var timestamp = new Date().getTime()
  var entityID = 'draw-area-' + timestamp
  var e = new Cesium.Entity({
    id: entityID,
    polygon: {
      shadows: Cesium.ShadowMode.CAST_ONLY,
      height: 10,
      outline: true,
      outlineWidth: 2.0,
      outlineColor: lineColor || Cesium.Color.RED,
      hierarchy: Cesium.Cartesian3.fromDegreesArray(item.positions),
      material: color || Cesium.Color.RED
    }
  })
  statusSataSource.entities.add(e)
  var entityObj = {
    id: entityID,
    entity: e,
    area: item.area
  }

  return entityObj
}

// 当前页面业务相关
function initWork () {
  viewer.scene.globe.depthTestAgainstTerrain = true
  viewer.imap.centerAt({
    y: 35.408226,
    x: 117.010959,
    z: 25000
  })
  // 默认搜索出所有信息
  searchCurrnetPage = 0
  projectAPI()
  getUserInfoAPI()
  areaListAPI()
  // viewer.scene.screenSpaceCameraController.enableTilt = false; //不准倾斜
  // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 5000; //相机的高度的最小值
  // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40000; //相机高度的最大值
  // viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
  // viewer.scene.screenSpaceCameraController._maximumZoomRate = 30000; //设置相机放大时的速率

  statusSataSource = new Cesium.CustomDataSource('statusSataSource')
  viewer.dataSources.add(statusSataSource)

  viewer.screenSpaceEventHandler.setInputAction(function () {},  Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  viewer.screenSpaceEventHandler.setInputAction(function () {}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  getLandData(function (success, data) {
    if (success) {
      landList = data
      search()
      groundPrimitive = new Cesium.Primitive({
        geometryInstances: createLandInstance(),
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true
        })
      })
      viewer.scene.primitives.add(groundPrimitive)
    }
  })

  viewer.scene.postRender.addEventListener(bind2scene)
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  // 设置单击事件的处理句柄
  handler.setInputAction(function (movement) {
    if (pickType == 1) {
      closePopup()

      var earthPosition = viewer.scene.pickPosition(movement.position)
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          startDraw = true
          activeShapePoints.push(earthPosition)
          var dynamicPositions = new Cesium.CallbackProperty(function () {
            return activeShapePoints
          }, false)

          activeShape = drawShape(dynamicPositions)
          viewer.entities.add(activeShape)
        }
        activeShapePoints.push(earthPosition)
      }
    } else if (pickType == 0) {
      isConflict = false
      var pickedObject = viewer.scene.pick(movement.position)
      closePopup()
      if (Cesium.defined(pickedObject)) {
        var pickid =
          typeof pickedObject.id === 'string'
            ? pickedObject.id
            : pickedObject.id.id
        // console.log(pickid);
        if (pickid.indexOf('land') != -1) {
          for (var index = 0; index < landList.length; index++) {
            if (landList[index].landid == pickedObject.id) {
              var cartesian = getCurrentMousePosition(
                viewer.scene,
                movement.position,
                null
              )
              if (landList[index].type && (landList[index].type).length > 0) {
                setPopupContent(cartesian, landList[index])
              }

              break
            }
          }
        } else if (pickid.indexOf('draw') != -1) {
          projectAPI()
          for (var i = 0; i < drawEntityList.length; i++) {
            if (drawEntityList[i].id === pickid) {
              currentDrawPick = drawEntityList[i]
              break
            }
          }
          // 获取 项目信息
          // console.log(currentDrawPick);
          var obj = currentDrawPick.obj
          if (obj.draw) {
            // 自己花
            viewModel.area = currentDrawPick.area
            viewModel.areaString = '约' + currentDrawPick.area + '亩'
            var arr = currentDrawPick.entity.polygon.hierarchy._value
            var poly1 = getCoordinate(arr)
            var tmp = []
            for (var i = 0; i < poly1.length; i++) {
              tmp.push(poly1[i][0])
              tmp.push(poly1[i][1])
            }
            viewModel.areaPoints = tmp.join(',')
            // console.log("画的区域经纬度：" + tmp.join(","));

            var intersect = [] // 储存 与地地块相交的取悦

            for (var i = 0; i < landList.length; i++) {
              // 检测地块冲突
              var item = landList[i]
              if (item.type && item.type.length > 0) {
                var poly2 = getCoordinateFromArr(item.positions)
                if (isIntersect(poly1, poly2)) {
                  intersect.push(item) //
                  if (item.status == '已入驻' || item.status == '企业意向') {
                    var instanceid = item.landid + ''
                    var instance = groundPrimitive.getGeometryInstanceAttributes(
                      instanceid
                    )
                    instance.color = Cesium.ColorGeometryInstanceAttribute.toValue(
                      new Cesium.Color(1, 0, 0, 0.3)
                    )
                  }
                }
              }
            }

            var areaIntersect = []
            for (var i = 0; i < areaList.length; i++) {
              // 检测地块冲突
              var item = areaList[i]
              var poly2 = getCoordinateFromArr(item.positions)
              if (isIntersect(poly1, poly2)) {
                if (item.status == '已入驻' || item.status == '企业意向') {
                  areaIntersect.push(item) //
                  // 画相交区域
                  if (!isAreaEixsted(item.id)) {
                    // rgba(56,236,233,0.6)
                    var entityObj = drawPolygon(item, new Cesium.Color(56 / 255.0, 236 / 255.0, 233 / 255.0, 1.0), new Cesium.Color(56 / 255.0, 236 / 255.0, 233 / 255.0, 0.6))
                    var obj = polygonObj(item, false)
                    entityObj.obj = obj
                    drawEntityList.push(entityObj)
                    getIntersectArea(item.id, entityObj.obj, function (success, data) {
                      if (success) {
                      }
                    })
                  } else {
                    // 根据id 获得 entity 改变颜色
                    var entityId = getAreaEixsted(item.id).id
                    var entity = statusSataSource.entities.getById(entityId)
                    entity.polygon.material = new Cesium.Color(56 / 255.0, 236 / 255.0, 233 / 255.0, 0.6)
                    entity.polygon.outlineColor = new Cesium.Color(56 / 255.0, 236 / 255.0, 233 / 255.0, 1.0)
                  }
                }
              }
            }
            intersectLandList = intersect
            intersectAreaList = areaIntersect
            // 设置相交区域列表
            showIntersectView()
            $('.pickPolygon').show()
          } else {
            // 搜索 直接赋值obj
            viewModel.area = obj.area
            viewModel.areaString = '约' + obj.area + '亩'
            viewModel.value = obj.projectId
            viewModel.projectName = obj.projectName
            viewModel.areaName = obj.areaName
            viewModel.company = obj.company
            viewModel.type = obj.type
            intersectLandList = obj.intersectList
            showIntersectView()
            $('.pickPolygon').show()
          }
        }
      } else {
        // 测试用
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(function (event) {
    if (pickType == 1) {
      if (startDraw) {
        var newPosition = viewer.scene.pickPosition(event.endPosition)
        if (Cesium.defined(newPosition)) {
          activeShapePoints.pop()
          activeShapePoints.push(newPosition)
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(function (event) {
    if (pickType == 1) {
      activeShapePoints.pop()
      activeShapePoints.pop()
      // 给 最后的entity 添加id标识
      var timestamp = new Date().getTime()
      var entityID = 'draw-' + timestamp
      var e = new Cesium.Entity({
        id: entityID,
        polygon: {
          height: 20,
          outline: true,
          outlineWidth: 1.0,
          outlineColor: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
          hierarchy: activeShapePoints,
          zIndex: 100,
          material: new Cesium.Color(1.0, 1.0, 1.0, 0.4)
        }
        // (r:1.00 g:0.25 b:0.18 a:1.00)
      })
      statusSataSource.entities.add(e)
      var area = calArea(e)
      // 保存信息
      var obj = {}
      obj.draw = true // true代表自己画的区域 false代表搜索画的区域
      obj.isUpdate = false
      drawEntityList.push({ id: entityID, entity: e, area: area, obj: obj })
      clearDrawStatus()
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
function clearDrawArea () {
  // 清空
  // drawEntityList = [];
  // viewer.dataSources.remove(statusSataSource, true);
  // statusSataSource = new Cesium.CustomDataSource("statusSataSource");
  // viewer.dataSources.add(statusSataSource);
}

function clearDrawStatus () {
  $('#draw span').text('开始选址')
  viewer.entities.remove(activeShape)
  pickType = 0
  startDraw = false
  activeShape = undefined
  activeShapePoints = []
}
/**
 *
 * @param {*} poly1  多边形1  [[],[]]
 * @param {*} poly2
 */
function isIntersect (poly1, poly2) {
  try {
    if (!poly2 || !poly1) {
      return false
    }
    var polyone = turf.polygon([poly1])
    var polytwo = turf.polygon([poly2])
    var intersection = turf.intersect(polyone, polytwo)
    if (intersection) {
      return true
    }
  } catch (error) {
  }
  return false
}

function updateViewPoint (cartesian) {
  var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    cartesian
  )
  if (point == null) return false
  var $view = $('#popupview')

  var x = point.x - $view.innerWidth() / 2
  var y = point.y - $view.innerHeight() - 4
  $('#popupview').show()
  $view.css('left', x + 'px')
  $view.css('top', y + 'px')
}
function closePopup () {
  popupObj = null
  // viewModel.intersectList = [];
  isConflict = false
  viewModel.value = ''
  viewModel.projectName = ''
  viewModel.areaName = ''
  viewModel.areaPoints = ''
  viewModel.company = ''
  viewModel.area = ''
  viewModel.areaString = ''
  viewModel.type = ''
  $('.pickPolygon').hide()
  $('#popupview').hide()
}
function setPopupContent (cartesian, contentObj) {
  // 设置html内容
  viewModel.land = contentObj
  popupObj = {
    cartesian: cartesian
  }
  updateViewPoint(cartesian)
}

function bind2scene () {
  if (popupObj) {
    updateViewPoint(popupObj.cartesian)
  }
}

function createPoint (worldPosition) {
  var point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
  return point
}
function drawShape (positionData) {
  return new Cesium.Entity({
    polygon: {
      height: 10,
      outline: true,
      outlineWidth: 1.0,
      outlineColor: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
      hierarchy: positionData,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.Color(1.0, 1.0, 1.0, 0.4)
      )
    }
  })
}

function getCoordinate (positions) {
  var coordinates = []
  for (var i = 0; i < positions.length; i++) {
    var carto = Cesium.Cartographic.fromCartesian(positions[i])
    var lng = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6))
    var lat = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6))
    var height = Number(carto.height.toFixed(1))
    coordinates.push([lng, lat, height])
  }
  // 复制第一个元素到最后
  if (coordinates.length > 0) {
    var first = coordinates[0]
    var last = coordinates[coordinates.length - 1]
    if (first[0] != last[0] || first[1] != last[1] || first[2] != last[2]) {
      coordinates.push(first)
    }
  }
  return coordinates
}

function calArea (polygonEntity) {
  var arr = polygonEntity.polygon.hierarchy._value
  if (arr.positions && this.isArray(arr.positions)) {
    arr = arr.positions
  }
  var coordinates = getCoordinate(arr)
  var JGEOSON = {
    type: 'Feature',
    properties: polygonEntity.attribute,
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates]
    }
  }
  var area = formatArea(turf.area(JGEOSON), 'mu')
  return area
}
/**  进行单位换算，格式化显示面积    */
function formatArea (val, unit) {
  if (val == null) return ''
  if (unit == null || unit == 'auto') {
    if (val < 1000000) unit = 'm'
    else unit = 'km'
  }
  var valstr = ''
  switch (unit) {
    default:
    case 'm':
      valstr = val.toFixed(2)
      break
    case 'km':
      valstr = (val / 1000000).toFixed(2)
      break
    case 'mu':
      valstr = (val * 0.0015).toFixed(2)
      break
    case 'ha':
      valstr = (val * 0.0001).toFixed(2)
      break
  }
  return valstr
}
