<template>
  <div id="container"></div>
</template>

<script>
import AMapUI from 'https://webapi.amap.com/ui/1.1/main.js'
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  securityJsCode: 'f464462874676b3f1469780a62e5b921'
}
export default {
  data() {
    return {
      map: null
    }
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "ca549d915cb38803582ca7e85c5f972c",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        plugins: ['AMap.Scale'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          version: '1.1',
          plugins: [''],
        },
      }).then((AMap) => {
        this.map = new AMap.Map("container", {  //设置地图容器id
          viewMode: "3D",    //是否为3D地图模式
          zoom: 5,           //初始化地图级别
          center: [113.795294, 27.880221], //初始化地图中心点位置
        });
        // const AMapUI = AMap.SimpleMarker
        // console.log('AMapUI', AMapUI);
        new AMapUI.SimpleMarker({
          iconLabel: 'A',
          iconTheme: '',
          iconStyle: 'red',
          map: this.map,
          position: this.map.getCenter()
        })
        this.map.addControl(new AMap.Scale())


        const marker = new AMap.Marker({
          position: new AMap.LngLat(113.795294, 27.880221),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '上栗'
        });
        this.map.add(marker);
      }).catch(e => {
        console.log(e);
      })
    },
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap()
  }

}
</script>

<style  scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 1920px;
  height: 1080px;
}
</style>
