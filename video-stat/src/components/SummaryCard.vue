<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { formatNumber } from '../utils/date.js'

const props = defineProps({
  videos: Array,
  categoryStats: Array,
})

const container = ref(null)
let ctx

// 用于数字动画的显示值
const animTotal = ref(0)
const animViews = ref(0)
const animLikes = ref(0)
const animEngage = ref(0)

const totalViews = computed(() =>
  props.videos.reduce((s, v) => s + v.view, 0)
)
const totalLikes = computed(() =>
  props.videos.reduce((s, v) => s + v.like, 0)
)
const avgEngagement = computed(() => {
  if (!props.videos.length) return 0
  const total = props.videos.reduce((s, v) => s + v.like + v.reply + v.share, 0)
  return parseFloat((total / props.videos.length).toFixed(1))
})
const topCategory = computed(() => props.categoryStats[0])

// 数字滚动动画
function animateCounts() {
  const targets = {
    total: props.videos.length,
    views: totalViews.value,
    likes: totalLikes.value,
    engage: avgEngagement.value,
  }
  gsap.to(
    { total: 0, views: 0, likes: 0, engage: 0 },
    {
      total: targets.total,
      views: targets.views,
      likes: targets.likes,
      engage: targets.engage,
      duration: 1.2,
      ease: 'power2.out',
      roundProps: 'total,views,likes',
      onUpdate: function () {
        const t = this.targets()[0]
        animTotal.value = t.total
        animViews.value = t.views
        animLikes.value = t.likes
        animEngage.value = t.engage
      },
    }
  )
}

watch(() => props.videos, async () => {
  await nextTick()
  ctx?.revert()
  if (!container.value) return
  ctx = gsap.context(() => {
    animateCounts()
  }, container.value)
}, { deep: true })

onUnmounted(() => {
  ctx?.revert()
})

// 格式化显示值
const totalFmt = computed(() => animTotal.value)
const viewsFmt = computed(() => formatNumber(animViews.value))
const likesFmt = computed(() => formatNumber(animLikes.value))
const engageFmt = computed(() => animEngage.value.toFixed(1))
</script>

<template>
  <div class="summary-row" ref="container">
    <div class="summary-card card-total">
      <div class="card-icon">📊</div>
      <div class="card-body">
        <div class="card-value">{{ totalFmt }}</div>
        <div class="card-label">视频总数</div>
      </div>
    </div>

    <div class="summary-card card-views">
      <div class="card-icon">👁️</div>
      <div class="card-body">
        <div class="card-value">{{ viewsFmt }}</div>
        <div class="card-label">总播放量</div>
      </div>
    </div>

    <div class="summary-card card-likes">
      <div class="card-icon">❤️</div>
      <div class="card-body">
        <div class="card-value">{{ likesFmt }}</div>
        <div class="card-label">总点赞</div>
      </div>
    </div>

    <div class="summary-card card-engage">
      <div class="card-icon">💬</div>
      <div class="card-body">
        <div class="card-value">{{ engageFmt }}</div>
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
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
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
