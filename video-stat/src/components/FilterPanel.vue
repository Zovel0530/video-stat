<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({ platform: String, period: String, sortBy: String, loading: Boolean })
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
      <el-radio-group :model-value="platform" @update:model-value="emit('update:platform', $event)" size="large">
        <el-radio-button v-for="p in platforms" :key="p.value" :value="p.value" :disabled="p.disabled">{{ p.label }}</el-radio-button>
      </el-radio-group>
      <span class="sep"></span>
      <el-radio-group :model-value="period" @update:model-value="emit('update:period', $event)" size="large">
        <el-radio-button v-for="p in periods" :key="p.value" :value="p.value">{{ p.label }}</el-radio-button>
      </el-radio-group>
      <span class="sep"></span>
      <el-select :model-value="sortBy" @update:model-value="emit('update:sortBy', $event)" size="large" class="sort-select" popper-class="dark-popper">
        <el-option v-for="opt in sortOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </div>
    <button class="fetch-btn" :disabled="loading" @click="emit('search')">
      <span v-if="loading" class="btn-spinner"></span>
      <Search v-else class="btn-icon" />
      {{ loading ? '获取中' : '获取数据' }}
    </button>
  </div>
</template>

<style scoped>
.filter-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 0;
}
.filter-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sep { width: 1px; height: 20px; background: var(--hairline); margin: 0 4px; }
.sort-select { width: 120px; }

/* ── 浅蓝 pill 按钮 ── */
.fetch-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 22px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out), background var(--duration) var(--ease-out), box-shadow var(--duration) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.fetch-btn:hover { background: var(--accent-hover); box-shadow: var(--shadow-glow); }
.fetch-btn:active { transform: scale(0.97); }
.fetch-btn:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
.btn-icon { width: 16px; height: 16px; }
.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
