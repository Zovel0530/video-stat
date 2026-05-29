<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const props = defineProps({
  categoryStats: Array,
})

const pieOption = computed(() => ({
  title: { text: '视频类型分布', left: 'center', textStyle: { fontSize: 15 } },
  tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['50%', '50%'],
    data: props.categoryStats.map(c => ({ name: c.name, value: c.count })),
    label: { formatter: '{b}\n{d}%' },
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
  }],
}))

const barOption = computed(() => ({
  title: { text: '各类型播放量对比', left: 'center', textStyle: { fontSize: 15 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: props.categoryStats.map(c => c.name),
    axisLabel: { rotate: 15 },
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '播放量',
      type: 'bar',
      data: props.categoryStats.map(c => c.view),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#79bbff' },
          ],
        },
        borderRadius: [6, 6, 0, 0],
      },
    },
    {
      name: '点赞',
      type: 'bar',
      data: props.categoryStats.map(c => c.like),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#e6a23c' },
            { offset: 1, color: '#f3d19e' },
          ],
        },
        borderRadius: [6, 6, 0, 0],
      },
    },
  ],
}))
</script>

<template>
  <div class="chart-row" v-if="categoryStats.length">
    <div class="chart-box">
      <v-chart :option="pieOption" autoresize style="height: 360px" />
    </div>
    <div class="chart-box">
      <v-chart :option="barOption" autoresize style="height: 360px" />
    </div>
  </div>
</template>

<style scoped>
.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}
.chart-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 20px;
}
</style>
