

<template>
  <div class="echarts-box">
    <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from "echarts";
// import china from '@/utils/china.json'
let echart = echarts;
onMounted(() => {
  initChart();
});

onUnmounted(() => {
  echart.dispose;
});
function initChart() {
  let chart = echart.init(document.getElementById("myEcharts"), "dark");
  // 把配置和数据放这里
  chart.setOption({
    xAxis: {
      type: "category",
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ]
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [
          820,
          932,
          901,
          934,
          1290,
          1330,
          1320,
          801,
          102,
          230,
          4321,
          4129
        ],
        type: "line",
        smooth: true
      }
    ]
  });
  return { initChart };
}
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
