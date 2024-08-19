<!-- 高德2.0版本 -->

<script setup>
import _ from 'lodash'
import hunan from '../src/utils/430000.json'
import { getAreaCode } from './utils/area.js'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
const showLoading = ref(true)
const centerList = ref([])
let map = null
let currentJson = hunan
// 行政区上浮
function up() {
  if (currentJson.name === hunan.name) {
    return
  }

  let fhcode = getAreaCode(currentJson.name)['codes'][0]
  console.log(fhcode)
  if (fhcode === '430000') {
    map.clearMap() //清除覆盖物
    //之所有这样写、是因为接口返回的数据有问题、所以用本地数据
    currentJson = hunan
    initPolygon(hunan)
  } else {
    if (fhcode) {
      map.clearMap() //清除覆盖物
      const url = 'https://www.hndyjqrh.cn/api/multialarm/pic/download?creator=geo&file=' + fhcode + '.geojson'
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log('🚀 ~ fetch.then ~ data:', data)
          currentJson = data
          initPolygon(data)
          map.setFitView() //调整视野，显示所有覆盖物
        })
    }
  }
}
// 自定义marker
// 文档: https://lbs.amap.com/api/javascript-api-v2/guide/amap-marker/custom-marker
// 省市区的名字
let renderMarker = function (item) {
  const { name = '', center = 0 } = item
  let marker = new AMap.Marker({
    content: `<div >${name}</div>`,
    anchor: 'center', // 设置文本标记锚点
    draggable: false,
    cursor: 'pointer',
    position: center,
    extData: item,
    zIndex: 1000,
  })

  marker.setMap(map)
}
// 找到维度最高的点

let marker2 = null
// marker 标记物的参数说明
// https://lbs.amap.com/api/javascript-api-v2/documentation#marker
let renderMarker2 = function (item) {
  const { name, center } = item

  if (!marker2) {
    marker2 = new AMap.Marker({
      content: `
                <div class="tooltip" style="background-color: white;border: 1px solid #ccc;box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);border-radius: 4px;padding: 8px;font-family: Arial, sans-serif; font-size: 14px;color: #333;">
                  <div class="tooltip-content">
                    <p style="margin: 0;line-height: 1.5;"><strong>adcode:</strong> 430600</p>
                    <p style="margin: 0;line-height: 1.5;"><strong>name:</strong> <a style=" color: blue;text-decoration: none;" href="#">${name}</a></p>
                    <p style="margin: 0;line-height: 1.5;"><strong>level:</strong> city</p>
                  </div>
                </div>
              `,
      anchor: 'bottom-left', // 设置文本标记锚点
      draggable: false, //设置点标记是否可拖拽移动，默认值：false
      cursor: 'pointer',
      position: center, //点标记在地图上显示的位置 //经纬度对象或经纬度构成的一维数组。例如：AMap.LngLat(116.39,39.9)或[116.39, 39.9]
      zIndex: 1000,
    })
    map.add(marker2)
  }
}
const clearMarker = function () {
  if (marker2 !== null) {
    map.remove(marker2)
    marker2 = null
  }
}
// let renderMarker2Debounced = _.debounce(renderMarker2, 100)
// let clearMarkerDebounced = _.debounce(clearMarker, 100)
const p_path = reactive({
  path: [], // 多边形轮廓线的节点坐标数组
})
// 添加覆盖物方法
let addPolygon = function (index) {
  let polygon = new AMap.Polygon({
    index: index,
    strokeWeight: 2, // 线条宽度，默认为 1
    path: p_path.path, // 多边形轮廓线的节点坐标数组

    clickable: false,
    // fillColor: '#ccebc5', // 多边形填充颜色
    fillOpacity: 0.8, //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
    fillColor: '#FAFBFC', // 多边形填充颜色

    strokeWeight: 1,
    strokeColor: '#3A4659', // 线条颜色
    lineJoin: 'round', // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
  })
  let polygon_mouseover = polygon.on('mouseover', () => {
    // 鼠标移入更改样式
    polygon.setOptions({
      fillOpacity: 0.8,
      fillColor: '#2681FF',
    })

    // 从经纬度数组中找到纬度最高的点
    let arr = currentJson.features[polygon_mouseover._opts.index].geometry.coordinates[0][0]
    const highestLatitudePoint = arr.reduce((highest, current) => {
      return current[1] > highest[1] ? current : highest
    }, arr[0])
    // console.log(highestLatitudePoint)
    let obj = {
      center: highestLatitudePoint,
      name: currentJson.features[polygon_mouseover._opts.index].properties.name,
    }
    renderMarker2(obj)
  })
  let polygon_mouseout = polygon.on('mouseout', () => {
    // 鼠标移出恢复样式
    polygon.setOptions({
      fillOpacity: 0.8,
      fillColor: '#FAFBFC',
    })

    clearMarker() // 立即清除 marker
  })
  // 下钻并且重新绘制覆盖物
  polygon.on('mousedown', (e) => {
    // console.log('mousedown下钻______________', e)
    console.log('currentJson_______________', currentJson)
    renderPolygon(e.target._opts.index)
  })

  map.add(polygon)
  // 缩放地图到合适的视野级别
  // map.setFitView([polygon])
  map.setFitView()
}

const renderPolygon = (i) => {
  // console.log('🚀 ~ renderPolygon ~ i, code_:', i, code_)

  const path = []
  currentJson.features.forEach((item, index) => {
    if (i == index) {
      // const url = `https://geo.datav.aliyun.com/areas_v3/bound/${item.properties.adcode}_full.json`
      // console.log('item.properties.adcode', item.properties.adcode)

      let code
      if (item.properties.hasOwnProperty('adcode')) {
        code = item.properties.adcode
      } else {
        if (item.properties.id.length === 5) {
          //暂时用 id 长度来判断、5位是最后一级
          return
        } else {
          code = item.properties.id
        }
      }
      map.clearMap() //移除覆盖物方法   //文档地址https://lbs.amap.com/api/javascript-api/guide/map/map-layer
      const url = 'https://www.hndyjqrh.cn/api/multialarm/pic/download?creator=geo&file=' + code + '.geojson'

      // fetch 返回的是promise、所以说需要链式调用
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log('🚀 ~ fetch.then ~ data:', data)
          currentJson = data
          initPolygon(data)
        })
    }
  })
  p_path.path = path
  addPolygon(i)
}

// 根据 geo数据获取 省区区的中心 坐标（经纬度）
function getCenter(arr) {
  let centerLonLat = []
  if (arr.length) {
    const lon = []
    const lat = []
    const poly = []
    for (let i = 0, len = arr.length; i < len; i++) {
      lon.push(arr[i][0])
      lat.push(arr[i][1])
    }
    for (let i = 0, len = lon.length; i < len; i++) {
      poly.push({
        x: parseFloat(lon[i]),
        y: parseFloat(lat[i]),
        z: 0,
      })
    }
    const sortedLongitudeArray = poly.map((item) => item.x).sort()
    const sortedLatitudeArray = poly.map((item) => item.y).sort()
    const centerLongitude = ((parseFloat(sortedLongitudeArray[0]) + parseFloat(sortedLongitudeArray[sortedLongitudeArray.length - 1])) / 2).toFixed(14)
    const centerLatitude = ((parseFloat(sortedLatitudeArray[0]) + parseFloat(sortedLatitudeArray[sortedLatitudeArray.length - 1])) / 2).toFixed(14)
    centerLonLat = [Number(centerLongitude), Number(centerLatitude)]
  }
  return centerLonLat
}
// 初始化渲染省市区
function initPolygon(data) {
  showLoading.value = true
  // console.log(data)

  data.features.forEach((item, index) => {
    let center = getCenter(item.geometry.coordinates[0][0])
    centerList.value.push(center)
    const path = []
    item.geometry.coordinates[0][0].forEach((ele) => {
      path.push(new AMap.LngLat(ele[0], ele[1]))
    })
    p_path.path = path
    addPolygon(index)
    // 渲染地名
    // renderMarker({
    //   name: item.properties.name,
    //   center: center,
    // })
  })
  map.setFitView() //根据覆盖物范围调整视野  //无参数，默认包括所有覆盖物的情况
  let timeID = setTimeout(() => {
    showLoading.value = false
    clearTimeout(timeID)
  }, 200)
}

onMounted(() => {
  // 初始化地图
  map = new AMap.Map('container', {
    // 设置地图容器id
    viewMode: '3D', // 是否为3D地图模式
    zoom: 1, // 初始化地图级别
    center: [113.801655, 27.870046], // 初始化地图中心点位置
    // mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
    // mapStyle: 'amap://styles/grey', //设置地图的显示样式
  })
  initPolygon(hunan)
  // map.setFitView() //根据覆盖物范围调整视野  //无参数，默认包括所有覆盖物的情况
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div id="container"></div>
  <button @click="up">行政区域上浮</button>
  <div v-if="showLoading" class="small-bg">
    <dv-loading>
      <div color-white>地图加载中...</div>
    </dv-loading>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
  position: relative; /* 使子元素的绝对定位相对于这个容器 */
}

.small-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景色 */
  z-index: 10; /* 确保在最上层 */
}
.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
}

.tooltip-content p {
  margin: 0;
  line-height: 1.5;
}

.tooltip-content a {
  color: blue;
  text-decoration: none;
}

.tooltip-content a:hover {
  text-decoration: underline;
}
</style>
