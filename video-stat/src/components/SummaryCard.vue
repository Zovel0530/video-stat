<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { formatNumber } from '../utils/date.js'

const props = defineProps({ videos: Array, categoryStats: Array })
const container = ref(null)
let ctx

const animTotal = ref(0); const animViews = ref(0)
const animLikes = ref(0); const animEngage = ref(0)

const totalViews = computed(() => props.videos.reduce((s, v) => s + v.view, 0))
const totalLikes = computed(() => props.videos.reduce((s, v) => s + v.like, 0))
const avgEngagement = computed(() => {
  if (!props.videos.length) return 0
  const t = props.videos.reduce((s, v) => s + v.like + v.reply + v.share, 0)
  return parseFloat((t / props.videos.length).toFixed(1))
})
const topCategory = computed(() => props.categoryStats[0])

watch(() => props.videos, () => {
  ctx?.revert()
  if (!container.value) return
  ctx = gsap.context(() => {
    gsap.to({ t: 0, v: 0, l: 0, e: 0 }, {
      t: props.videos.length, v: totalViews.value, l: totalLikes.value, e: avgEngagement.value,
      duration: 0.9, ease: 'power2.out', roundProps: 't,v,l',
      onUpdate: function() { const o = this.targets()[0]; animTotal.value = o.t; animViews.value = o.v; animLikes.value = o.l; animEngage.value = o.e },
    })
  }, container.value)
}, { deep: true })

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div class="summary-row" ref="container">
    <div class="summary-card">
      <p class="card-value">{{ animTotal }}</p>
      <p class="card-label">视频总数</p>
    </div>
    <div class="summary-card">
      <p class="card-value">{{ formatNumber(animViews) }}</p>
      <p class="card-label">总播放量</p>
    </div>
    <div class="summary-card">
      <p class="card-value">{{ formatNumber(animLikes) }}</p>
      <p class="card-label">总点赞</p>
    </div>
    <div class="summary-card">
      <p class="card-value">{{ animEngage.toFixed(1) }}</p>
      <p class="card-label">平均互动</p>
    </div>
    <div class="summary-card card-accent" v-if="topCategory">
      <p class="card-value accent">{{ topCategory.name }}</p>
      <p class="card-label">最热分类 · {{ topCategory.count }} 个视频</p>
    </div>
  </div>
</template>

<style scoped>
.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.summary-card {
  padding: 24px;
  background: var(--surface-1);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--radius-md);
  transition: transform var(--duration) var(--ease-out), box-shadow var(--duration) var(--ease-out), border-color var(--duration) var(--ease-out);
}
.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
  border-color: var(--hairline);
}

.card-accent {
  background: var(--accent);
  border-color: var(--accent);
}
.card-accent .card-value,
.card-accent .card-label { color: #fff; }

.card-value {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1.1;
}
.card-value.accent { color: #fff; }

.card-label {
  margin: 8px 0 0;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-subtle);
}
</style>
