export function wgs84togcj02([lng, lat]) {
  // return [lng, lat]
  // 定义一些常量
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  var lat = +lat;
  var lng = +lng;
  // 判断是否在国内，不在国内则不做偏移
  if (!(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)) {
    return [lng, lat];
  } else {
    // 转换lat
    var dlatplng = lng - 105.0,
      dlatplat = lat - 35.0;
    var dlat =
      -100.0 +
      2.0 * dlatplng +
      3.0 * dlatplat +
      0.2 * dlatplat * dlatplat +
      0.1 * dlatplng * dlatplat +
      0.2 * Math.sqrt(Math.abs(dlatplng));
    dlat +=
      ((20.0 * Math.sin(6.0 * dlatplng * PI) +
        20.0 * Math.sin(2.0 * dlatplng * PI)) *
        2.0) /
      3.0;
    dlat +=
      ((20.0 * Math.sin(dlatplat * PI) +
        40.0 * Math.sin((dlatplat / 3.0) * PI)) *
        2.0) /
      3.0;
    dlat +=
      ((160.0 * Math.sin((dlatplat / 12.0) * PI) +
        320 * Math.sin((dlatplat * PI) / 30.0)) *
        2.0) /
      3.0;

    // 转换lng
    var dlngplng = lng - 105.0,
      dlngplat = lat - 35.0;
    var dlng =
      300.0 +
      dlngplng +
      2.0 * dlngplat +
      0.1 * dlngplng * dlngplng +
      0.1 * dlngplng * dlngplat +
      0.1 * Math.sqrt(Math.abs(dlngplng));
    dlng +=
      ((20.0 * Math.sin(6.0 * dlngplng * PI) +
        20.0 * Math.sin(2.0 * dlngplng * PI)) *
        2.0) /
      3.0;
    dlng +=
      ((20.0 * Math.sin(dlngplng * PI) +
        40.0 * Math.sin((dlngplng / 3.0) * PI)) *
        2.0) /
      3.0;
    dlng +=
      ((150.0 * Math.sin((dlngplng / 12.0) * PI) +
        300.0 * Math.sin((dlngplng / 30.0) * PI)) *
        2.0) /
      3.0;

    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;

    return [mglng, mglat];
  }
}


let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
export function ba_gd([bd_lon,bd_lat]){
     let  x = Number(bd_lon- 0.0065) 
     let y = Number( bd_lat- 0.006)
     let z = Number(Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi))
     let theta = Number(Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi))
     const gd_lon  = Number(z * Math.cos(theta))
     const gd_lat  = Number(z * Math.sin(theta))
     console.log(bd_lon);
     console.log(bd_lat);
     return [gd_lon,gd_lat]
}





// 引入proj4js库
import proj4 from "proj4";
// 定义WGS84和EPSG:3857的投影字符串
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
const epsg3857 =
  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs";
// 创建proj4的转换函数
const transform = proj4(wgs84, epsg3857);
// 定义WGS84坐标

const lng = 120.12345;
const lat = 30.6789;

export function wgs84toepsg3857([lng, lat]) {
  const [x, y] = transform.forward([lng, lat]);
  console.log(`WGS84坐标(${lng}, ${lat}) 转换为 EPSG:3857坐标 (${x}, ${y})`);
  return [x, y];
}

// 将WGS84坐标转换为EPSG:3857坐标
