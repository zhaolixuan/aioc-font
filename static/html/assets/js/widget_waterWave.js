/**********************************
 * Description: 水波纹
 * Author: wenpeifang
 * Date: 2019/1/23 Time: 16:26
 * Example:
 * cs3d.jdWigdet.init(_viewer);
 * cs3d.jdWigdet.activate({
        id:'#02-01',
        name:'水波纹',
        uri: 'assets/js/widget_waterWave.js',
        disableOhter:false,
        dataFormatter:function(result){ // 如果data中url不为空需提供dataFormatter方法格式如下返回数组
            var list = [];
            var obj = {
                position : [lon,lat],
                waterWaveRadus : 150,
                waterWaveHeight : 1,
                barHeight:200,
                color:scanColor
            };
            list.push(obj);
            return list;
        },
        data: {
            positions:[[lon,lat],[lon,lat],[lon,lat]],  //经纬度数组
            waterWaveRadus:400,  水波纹半径
            waterWaveHeight:10,  水波纹离地高度
            barHeight:200,         水波纹中间棍儿的高度
            color:null   水波纹颜色
        }
    })
 ***********************************/
cs3d.jdWidget.bindClass(
  cs3d.widget.BaseWidget.extend({
    options: {},
    data: null,

    // 初始化[仅执行1次]
    create: function () {},

    // 打开激活
    activate: function () {
      let _this = this
      var dataSource = new Cesium.CustomDataSource('waterwave')
      // 判断是否是url传递的数据
      if (this.config.data.url) {
        if (typeof this.config.dataFormatter !== 'function') {
          throw 'dataFormatter 不是函数或不存在'
        }

        $.getJSON(_this.config.data.url, function (result) {
          // 必须传递datafamtter函数
          var list = _this.config.dataFormatter(result)
          list.map(item => {
            // console.log(item)
            var waterWaveHeight = item.waterWaveHeight || 1
            var barHeight = item.barHeight || 150
            var positions = Cesium.Cartesian3.fromDegreesArrayHeights([
              item.position[0],
              item.position[1],
              waterWaveHeight,
              item.position[0],
              item.position[1],
              barHeight + waterWaveHeight
            ])

            var entity = new Cesium.Entity({
              polyline: {
                positions: positions,
                width: 15,
                material: new Cesium.PolylineCustomLinkMaterialProperty({
                  color: new Cesium.Color(1, 1, 1, 0.7),
                  duration: 9000,
                  image:
                    '../lib/CesiumPlugins/newGeometry/Textures/LinkWithoutArrow.png'
                })
              }
            })
            dataSource.entities.add(entity)

            // 添加水波纹

            var waveEntity = new Cesium.Entity({
              position: Cesium.Cartesian3.fromDegrees(
                item.position[0],
                item.position[1],
                0
              ),
              ellipse: {
                height: waterWaveHeight,
                semiMinorAxis: item.waterWaveRadus || 150,
                semiMajorAxis: item.waterWaveRadus || 150,
                material: new Cesium.WaterWaveMaterialProperty({
                  color: item.color || new Cesium.Color(1, 0.0, 0.0, 0.7)
                })
              }
            })
            dataSource.entities.add(waveEntity)
          })
          _this.viewer.dataSources.add(dataSource)
        })
      } else {
        var positions = this.config.data.positions
        let colors = _this.config.data.color;
        for (var i = 0; i < positions.length; i++) {
          let position = positions[i]
          let color
          if (typeof colors === 'object' && colors.length > 1) {
            color = i < colors.length ? colors[i] : colors[colors.length % i]
          } else {
            color = colors
          }
          var entity = new Cesium.Entity({
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                position[0],
                position[1],
                _this.config.data.waterWaveHeight,
                position[0],
                position[1],
                _this.config.data.barHeight + _this.config.data.waterWaveHeight
              ]),
              width: 15,
              material: new Cesium.PolylineCustomLinkMaterialProperty({
                color: color || new Cesium.Color(1, 1, 1).withAlpha(0.7),
                duration: 9000,
                image: '../lib/CesiumPlugins/newGeometry/Textures/LinkWithoutArrow.png'
              })
            }
          })

          dataSource.entities.add(entity)

          // 添加水波纹

          var waveEntity = new Cesium.Entity({
            position: Cesium.Cartesian3.fromDegrees(
              position[0],
              position[1],
              0
            ),
            ellipse: {
              height: _this.config.data.waterWaveHeight || 1,
              semiMinorAxis: _this.config.data.waterWaveRadus || 150,
              semiMajorAxis: _this.config.data.waterWaveRadus || 150,
              material: new Cesium.WaterWaveMaterialProperty({
                color: color || new Cesium.Color(1, 0.0, 0.0, 0.7)
              })
            }
          })
          dataSource.entities.add(waveEntity)
        }
        _this.viewer.dataSources.add(dataSource)
      }

      this.data = dataSource
    },

    // 关闭释放
    disable: function () {
      if (this.data) {
        this.viewer.dataSources.remove(this.data)
        this.data = null
      }
    }
  })
)
