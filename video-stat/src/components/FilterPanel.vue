<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  platform: String,
  period: String,
  sortBy: String,
  loading: Boolean,
})

const emit = defineEmits(['update:platform', 'update:period', 'update:sortBy', 'search'])

const platforms = [
  { value: 'bilibili', label: 'B站' },
  { value: 'douyin', label: '抖音 (开发中)', disabled: true },
]

const periods = [
  { value: 'week', label: '近7天' },
  { value: 'month', label: '近30天' },
]

const sortOptions = [
  { value: 'view', label: '播放量' },
  { value: 'like', label: '点赞量' },
  { value: 'reply', label: '评论量' },
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

      <el-divider direction="vertical" />

      <span class="filter-label">排序依据</span>
      <el-select
        :model-value="sortBy"
        @update:model-value="emit('update:sortBy', $event)"
        size="large"
        style="width: 130px"
      >
        <el-option
          v-for="opt in sortOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
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
