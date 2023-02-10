var WaterWave = (
    function (){

        function getLinkedPointList(startPoint, endPoint) {
            let result = [];
            result.push(new Cesium.Cartesian3.fromDegrees(startPoint.x, startPoint.y, startPoint.z));
            let length = endPoint.z - startPoint.z;
            for (let i = 1; i < 100 - 1; i++) {
                let centerPoint = new Cesium.Cartesian3.fromDegrees(startPoint.x, startPoint.y, startPoint.z + (length / 100) * i);
                result.push(centerPoint);
            }
            result.push(new Cesium.Cartesian3.fromDegrees(endPoint.x, endPoint.y, endPoint.z));

            return result;
        }
        /**
         * 
         * @param {*} viewer 
         * @param {*} 维度 
         * @param {*} 经度 
         * @param {*} 水波纹高度 
         * @param {*} 水波纹半径 
         * @param {*} 竖直bar高度 
         * @param {*} 水波纹颜色 
         * @param {*} 动画时间  暂时未用 
         */
        function _(viewer,lat,lon,waveHeight,radius,barHeight,scanColor,duration){
            addBar(lon, lat,barHeight)
            addWaterWave(viewer, lat,lon, radius,waveHeight, scanColor, duration);
        }

        function addBar(lon, lat,height) {
            startPosition = new Cesium.Cartesian3(lon, lat, 5);

            var materialPositions = getLinkedPointList(startPosition, new Cesium.Cartesian3(startPosition.x, startPosition.y, startPosition.z + height))
            viewer.entities.add({
                polyline: {
                    positions: materialPositions,
                    width: 15,
                    material: new Cesium.PolylineCustomLinkMaterialProperty({
                        color: new Cesium.Color(1, 1, 1, 0.7),
                        duration: 9000,
                        image: "../lib/CesiumPlugins/newGeometry/Textures/LinkWithoutArrow.png"
                    }),
                }
            })
        
       
        }
        function addWaterWave(viewer, lat,lon, radius,height, scanColor, duration){
        
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),

                ellipse: {
                    height: height,
                    semiMinorAxis: radius,
                    semiMajorAxis: radius,
                    material: new Cesium.WaterWaveMaterialProperty({
                        color: scanColor
                    }),

                }
            })
        }
        return _;
    }
)()