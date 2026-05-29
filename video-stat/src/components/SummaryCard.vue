<script setup>
import { computed } from 'vue'
import { formatNumber } from '../utils/date.js'

const props = defineProps({
  videos: Array,
  categoryStats: Array,
})

const totalViews = computed(() =>
  props.videos.reduce((s, v) => s + v.view, 0)
)
const totalLikes = computed(() =>
  props.videos.reduce((s, v) => s + v.like, 0)
)
const avgEngagement = computed(() => {
  if (!props.videos.length) return 0
  const total = props.videos.reduce((s, v) => s + v.like + v.reply + v.share, 0)
  return (total / props.videos.length).toFixed(1)
})
const topCategory = computed(() => props.categoryStats[0])
</script>

<template>
  <div class="summary-row">
    <div class="summary-card card-total">
      <div class="card-icon">📊</div>
      <div class="card-body">
        <div class="card-value">{{ videos.length }}</div>
        <div class="card-label">视频总数</div>
      </div>
    </div>

    <div class="summary-card card-views">
      <div class="card-icon">👁️</div>
      <div class="card-body">
        <div class="card-value">{{ formatNumber(totalViews) }}</div>
        <div class="card-label">总播放量</div>
      </div>
    </div>

    <div class="summary-card card-likes">
      <div class="card-icon">❤️</div>
      <div class="card-body">
        <div class="card-value">{{ formatNumber(totalLikes) }}</div>
        <div class="card-label">总点赞</div>
      </div>
    </div>

    <div class="summary-card card-engage">
      <div class="card-icon">💬</div>
      <div class="card-body">
        <div class="card-value">{{ avgEngagement }}</div>
        <div class="card-label">平均互动</div>
      </div>
    </div>

    <div class="summary-card card-top" v-if="topCategory">
      <div class="card-icon">🔥</div>
      <div class="card-body">
        <div class="card-value">{{ topCategory.name }}</div>
        <div class="card-label">最热分类 · {{ topCategory.count }}个视频</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #409eff;
}
.card-icon { font-size: 28px; }
.card-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}
.card-label {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}
.card-views { border-left-color: #67c23a; }
.card-likes { border-left-color: #e6a23c; }
.card-engage { border-left-color: #f56c6c; }
.card-top { border-left-color: #e040fb; }
</style>
