<script setup>
import { Download } from '@element-plus/icons-vue'
import { exportToExcel } from '../utils/excel.js'

const props = defineProps({
  videos: Array,
  categoryStats: Array,
  period: String,
  platform: String,
  disabled: Boolean,
})

function handleExport() {
  exportToExcel({
    videos: props.videos,
    categoryStats: props.categoryStats,
    period: props.period,
    platform: props.platform,
  })
}
</script>

<template>
  <el-button
    type="success"
    size="large"
    :icon="Download"
    :disabled="disabled"
    class="export-btn"
    @click="handleExport"
  >
    导出 Excel 报表
  </el-button>
</template>

<style scoped>
.export-btn {
  font-family: var(--font-body) !important;
  font-weight: 400 !important;
  letter-spacing: 1px !important;
  border-radius: var(--radius-pill) !important;
  padding: 8px 20px !important;
  background: transparent !important;
  color: var(--ink-muted) !important;
  border: 1px solid var(--hairline) !important;
  transition: all 0.3s var(--ease-out) !important;
}
.export-btn:hover {
  color: var(--accent) !important;
  border-color: var(--accent) !important;
  transform: translateY(-1px);
}
</style>
