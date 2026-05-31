<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const props = defineProps({
  categoryStats: Array,
})

const container = ref(null)
let ctx

onMounted(() => {
  if (!container.value) return
  ctx = gsap.context(() => {
    // 图表盒子悬停微动效通过 CSS transition 处理，这里只做入场后的增强
    gsap.from('.chart-box', {
      scale: 0.98,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, container.value)
})

onUnmounted(() => {
  ctx?.revert()
})

const pieOption = computed(() => ({
  title: { text: '视频类型分布', left: 'center', textStyle: { fontSize: 15, color: '#b3b3b3' } },
  tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)', backgroundColor: '#18181b', borderColor: '#34343a', textStyle: { color: '#f7f8f8' } },
  legend: { bottom: 0, textStyle: { color: '#8a8f98' } },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['50%', '50%'],
    data: props.categoryStats.map(c => ({ name: c.name, value: c.count })),
    label: { formatter: '{b}\n{d}%', color: '#b3b3b3' },
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
  }],
}))

const barOption = computed(() => ({
  title: { text: '各类型播放量对比', left: 'center', textStyle: { fontSize: 15, color: '#b3b3b3' } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#18181b', borderColor: '#34343a', textStyle: { color: '#f7f8f8' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: props.categoryStats.map(c => c.name),
    axisLabel: { rotate: 15, color: '#8a8f98' },
    axisLine: { lineStyle: { color: '#34343a' } },
  },
  yAxis: { type: 'value', axisLabel: { color: '#8a8f98' }, splitLine: { lineStyle: { color: '#23252a' } } },
  series: [
    {
      name: '播放量',
      type: 'bar',
      data: props.categoryStats.map(c => c.view),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#b8956a' },
            { offset: 1, color: '#d4b98a' },
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
            { offset: 0, color: '#6a6a6a' },
            { offset: 1, color: '#8a8a8a' },
          ],
        },
        borderRadius: [6, 6, 0, 0],
      },
    },
  ],
}))
</script>

<template>
  <div class="chart-row" ref="container">
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
  position: relative;
  z-index: 1;
}
.chart-box {
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--hairline);
  padding: 20px;
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
  position: relative;
}
.chart-box:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
  border-color: var(--hairline-strong);
}
</style>
