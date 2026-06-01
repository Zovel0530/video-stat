<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from '../composables/useTheme.js'

use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const props = defineProps({ categoryStats: Array })
const { theme } = useTheme()

const isDark = computed(() => theme.value === 'dark')

const pieColors = computed(() =>
  isDark.value
    ? ['#b89764', '#c9ad80', '#d4c0a0', '#dfd0bc', '#a08060', '#7d6b50', '#5c5040', '#2a2a2d', '#3a3530', '#1e1f23']
    : ['#4488f0', '#6aa4f4', '#90c0f8', '#b4d4fa', '#5b9bd5', '#7799bb', '#99aaaa', '#c8c8cc', '#a0a0a4', '#e0e0e0']
)

const pieOption = computed(() => ({
  backgroundColor: 'transparent',
  title: { text: '视频类型分布', left: 'center', textStyle: { fontSize: 15, fontWeight: 600, color: isDark.value ? '#e8e4df' : '#1d1d1f', fontFamily: 'Inter, sans-serif' } },
  tooltip: {
    trigger: 'item', formatter: '{b}: {c} 个 ({d}%)',
    backgroundColor: isDark.value ? '#17181a' : '#fff',
    borderColor: isDark.value ? '#1e1f23' : '#e0e0e0',
    textStyle: { color: isDark.value ? '#e8e4df' : '#1d1d1f', fontFamily: 'Inter, sans-serif' },
  },
  legend: { bottom: 0, textStyle: { color: isDark.value ? '#78736e' : '#86868b', fontFamily: 'Inter, sans-serif' } },
  color: pieColors.value,
  series: [{
    type: 'pie', radius: ['45%', '70%'], center: ['50%', '48%'],
    data: props.categoryStats.map(c => ({ name: c.name, value: c.count })),
    label: { formatter: '{b}\n{d}%', color: isDark.value ? '#a09b95' : '#4d4d4f', fontSize: 12 },
    emphasis: { itemStyle: { shadowBlur: 6, shadowOffsetX: 0, shadowColor: isDark.value ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' } },
  }],
}))

const barOption = computed(() => ({
  backgroundColor: 'transparent',
  title: { text: '各类型播放量对比', left: 'center', textStyle: { fontSize: 15, fontWeight: 600, color: isDark.value ? '#e8e4df' : '#1d1d1f', fontFamily: 'Inter, sans-serif' } },
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    backgroundColor: isDark.value ? '#17181a' : '#fff',
    borderColor: isDark.value ? '#1e1f23' : '#e0e0e0',
    textStyle: { color: isDark.value ? '#e8e4df' : '#1d1d1f', fontFamily: 'Inter, sans-serif' },
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: props.categoryStats.map(c => c.name), axisLabel: { color: isDark.value ? '#78736e' : '#86868b', fontSize: 12 }, axisLine: { lineStyle: { color: isDark.value ? '#1e1f23' : '#e0e0e0' } } },
  yAxis: { type: 'value', axisLabel: { color: isDark.value ? '#78736e' : '#86868b', fontSize: 12 }, splitLine: { lineStyle: { color: isDark.value ? '#1e1f23' : '#f0f0f0' } } },
  series: [
    { name: '播放量', type: 'bar', data: props.categoryStats.map(c => c.view), itemStyle: { color: isDark.value ? '#b89764' : '#4488f0', borderRadius: [6, 6, 0, 0] }, barWidth: '40%' },
    { name: '点赞', type: 'bar', data: props.categoryStats.map(c => c.like), itemStyle: { color: isDark.value ? '#2a2a2d' : '#c8c8cc', borderRadius: [6, 6, 0, 0] }, barWidth: '40%' },
  ],
}))
</script>

<template>
  <div class="chart-row">
    <div class="chart-box"><v-chart :option="pieOption" autoresize style="height: 360px" /></div>
    <div class="chart-box"><v-chart :option="barOption" autoresize style="height: 360px" /></div>
  </div>
</template>

<style scoped>
.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}
.chart-box {
  background: var(--surface-1);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--radius-md);
  padding: 28px 20px 20px;
  transition: transform var(--duration) var(--ease-out), box-shadow var(--duration) var(--ease-out);
}
.chart-box:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}
</style>
