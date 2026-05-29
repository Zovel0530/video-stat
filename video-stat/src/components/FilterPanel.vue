<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  platform: String,
  period: String,
  loading: Boolean,
})

const emit = defineEmits(['update:platform', 'update:period', 'search'])

const platforms = [
  { value: 'bilibili', label: 'B站' },
  { value: 'douyin', label: '抖音 (开发中)', disabled: true },
]

const periods = [
  { value: 'week', label: '近7天' },
  { value: 'month', label: '近30天' },
]
</script>

<template>
  <div class="filter-panel">
    <div class="filter-left">
      <span class="filter-label">平台</span>
      <el-radio-group
        :model-value="platform"
        @update:model-value="emit('update:platform', $event)"
        size="large"
      >
        <el-radio-button
          v-for="p in platforms"
          :key="p.value"
          :value="p.value"
          :disabled="p.disabled"
        >
          {{ p.label }}
        </el-radio-button>
      </el-radio-group>

      <el-divider direction="vertical" />

      <span class="filter-label">时间范围</span>
      <el-radio-group
        :model-value="period"
        @update:model-value="emit('update:period', $event)"
        size="large"
      >
        <el-radio-button v-for="p in periods" :key="p.value" :value="p.value">
          {{ p.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <el-button
      type="primary"
      size="large"
      :loading="loading"
      :icon="Search"
      @click="emit('search')"
    >
      获取数据
    </el-button>
  </div>
</template>

<style scoped>
.filter-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 12px;
}
.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-label {
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}
</style>
