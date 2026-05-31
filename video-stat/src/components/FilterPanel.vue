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

      <el-divider direction="vertical" class="filter-divider" />

      <span class="filter-label">时间</span>
      <el-radio-group
        :model-value="period"
        @update:model-value="emit('update:period', $event)"
        size="large"
      >
        <el-radio-button v-for="p in periods" :key="p.value" :value="p.value">
          {{ p.label }}
        </el-radio-button>
      </el-radio-group>

      <el-divider direction="vertical" class="filter-divider" />

      <span class="filter-label">排序</span>
      <el-select
        :model-value="sortBy"
        @update:model-value="emit('update:sortBy', $event)"
        size="large"
        class="sort-select"
        popper-class="dark-popper"
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
      class="fetch-btn"
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
  padding: 18px 24px;
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--hairline);
  flex-wrap: wrap;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--ink-subtle);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.filter-divider {
  border-color: var(--hairline) !important;
  margin: 0 4px;
}

.sort-select {
  width: 130px;
}

/* ── CTA 按钮：克制 accent ── */
.fetch-btn {
  font-family: var(--font-body) !important;
  font-weight: 400 !important;
  letter-spacing: 1px !important;
  border-radius: var(--radius-pill) !important;
  padding: 8px 22px !important;
  background: transparent !important;
  color: var(--ink) !important;
  border: 1px solid var(--hairline-strong) !important;
  transition: all 0.3s var(--ease-out) !important;
}
.fetch-btn:hover {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
  transform: translateY(-1px);
}
.fetch-btn:active {
  transform: translateY(0);
}
</style>
