
import jx from './jx_map/jx.json'
import fuzhou from './jx_map/fuzhou.json'
import jian from './jx_map/jian.json'
import jingdezheng from './jx_map/jingdezheng.json'
import jiujiang from './jx_map/jiujiang.json'
import nanchang from './jx_map/nanchang.json'
import pingxiang from './jx_map/pingxiang.json'
import shangrao from './jx_map/shangrao.json'
import xinyu from './jx_map/xinyu.json'
import yichun from './jx_map/yichun.json'
import yingtan from './jx_map/yingtan.json'
const mapDict = {
  "抚州市": "fuzhou",
  "吉安市": "jian",
  "景德镇市": "jingdezheng",
  "九江市": "jiujiang",
  "南昌市": "nanchang",
  "萍乡市": "pingxiang",
  "上饶市": "shangrao",
  "新余市": "xinyu",
  "宜春市": "yichun",
  "鹰潭市": "yingtan",
}

const mapData = {
  fuzhou,
  jian,
  jingdezheng,
  jiujiang,
  nanchang,
  pingxiang,
  shangrao,
  xinyu,
  yichun,
  yingtan,

}

export function getMap(mapName) {
  const cityName = mapDict[mapName]
  // console.log(cityName);
  if (cityName) {
    // console.log('1111',cityName, mapData[cityName]);
    return [cityName, mapData[cityName]]

  }
  return ['jx', jx]
}

