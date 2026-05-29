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
    @click="handleExport"
  >
    导出 Excel 报表
  </el-button>
</template>
