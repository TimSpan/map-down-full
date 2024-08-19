<!-- e.target.G.index -->
<!-- G是 对应的高德1.3的版本、这个版本缩放很卡 -->
<template>
  <div id="map">
    <div id="container"></div>
  </div>
</template>

<script setup>
import slx from '../src/utils/shangli/shangli.json'
import MapLoader from '@/plugin/aMap'
import { onMounted, reactive } from 'vue'
onMounted(() => {
  MapLoader().then((AMap) => {
    console.log('地图加载成功')

    const map = new AMap.Map('container', {
      zoom: 4,
      // resizeEnable: true,
      center: [113.801655, 27.870046],
    })

    // 自定义marker
    // 文档: https://lbs.amap.com/api/javascript-api-v2/guide/amap-marker/custom-marker
    let renderMarker = function (item) {
      const { name = '', center = 0 } = item
      let marker = new AMap.Marker({
        content: `<div class='area-map-marker__title' style='font-weight: bold;'>${name}</div>`,
        anchor: 'center', // 设置文本标记锚点
        draggable: false,
        cursor: 'pointer',
        position: center,
        extData: item,
        zIndex: 1000,
      })

      marker.setMap(map)
    }

    const p_path = reactive({
      path: [],
    })
    let addPolygon = function (index) {
      let polygon = new AMap.Polygon({
        index: index,
        strokeWeight: 2, // 线条宽度，默认为 1
        path: p_path.path, // 多边形轮廓线的节点坐标数组
        fillOpacity: 0.5,
        clickable: false,
        fillColor: '#ccebc5', // 多边形填充颜色
        strokeColor: '#8B0000', // 线条颜色
        lineJoin: 'round', // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
      })
      polygon.on('mouseover', () => {
        // 鼠标移入更改样式
        polygon.setOptions({
          fillOpacity: 0.7,
          fillColor: '#7bccc4',
        })
      })
      polygon.on('mouseout', () => {
        // 鼠标移出恢复样式
        polygon.setOptions({
          fillOpacity: 0.5,
          fillColor: '#ccebc5',
        })
        try {
          renderMarker({
            name: 'item.properties.name',
            center: 4,
          })
        } catch (error) {
          console.log('🚀 ~ polygon.on ~ error:', error)
        }
      })
      // 下钻并且重新绘制地图
      polygon.on('mousedown', (e) => {
        // console.log(e);
        const path = []
        slx.features.forEach((item, index) => {
          if (e.target.G.index == index) {
            map.clearMap() //移除覆盖物方法   //文档地址https://lbs.amap.com/api/javascript-api/guide/map/map-layer
            slx.features[e.target.G.index].geometry.coordinates[0].forEach((ele, i) => {
              path.push(new AMap.LngLat(ele[0], ele[1]))
            })
          }
        })
        p_path.path = path
        addPolygon(e.target.G.index)
      })

      map.add(polygon)
      // 缩放地图到合适的视野级别
      map.setFitView([polygon])
    }

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
        console.log(centerLongitude, centerLatitude)
        centerLonLat = [Number(centerLongitude), Number(centerLatitude)]
      }
      return centerLonLat
    }

    // 初始遍历上栗地图范围数据
    slx.features.forEach((item, index) => {
      // console.log(2);
      let center = getCenter(item.geometry.coordinates[0])
      console.log('center', center)
      renderMarker({
        name: item.properties.name,
        center: center,
      })

      const path = []
      item.geometry.coordinates[0].forEach((ele, i) => {
        path.push(new AMap.LngLat(ele[0], ele[1]))
      })
      p_path.path = path
      addPolygon(index)
    })
  })
})
</script>
<style>
#map {
  height: calc(100vh - 46px);
  /* height: 100vh;
  width: 100vw; */
}

#container {
  width: 100%;
  height: 100%;
}

#loading {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
}

.area-map-marker {
  padding: 0.4rem 1rem;
  border-radius: 0.2rem;
  background-color: white;
  border-width: 0;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 14px;
  color: #111;
}

.area-map-marker__title,
.area-map-marker__count {
  white-space: nowrap;
}
</style>
