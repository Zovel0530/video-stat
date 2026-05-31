<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { fetchPopularVideos } from '../api/bilibili.js'
import { classifyVideo, getCategoryStats, filterByPeriod } from '../utils/classifier.js'
import FilterPanel from '../components/FilterPanel.vue'
import SummaryCard from '../components/SummaryCard.vue'
import DataChart from '../components/DataChart.vue'
import DataTable from '../components/DataTable.vue'
import ExportButton from '../components/ExportButton.vue'
import ThemeToggle from '../components/ThemeToggle.vue'

const platform = ref('bilibili')
const period = ref('week')
const sortBy = ref('view')
const loading = ref(false)
const videos = ref([])
const categoryStats = ref([])
const hasData = ref(false)
const errorMsg = ref('')
const pageRef = ref(null)
let pageCtx

const sortedVideos = computed(() => {
  const list = [...videos.value]
  list.sort((a, b) => (b[sortBy.value] || 0) - (a[sortBy.value] || 0))
  return list
})

onMounted(() => {
  pageCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.page-header', { y: -24, autoAlpha: 0, duration: 0.6 })
    tl.from('.filter-panel', { y: 12, autoAlpha: 0, duration: 0.45 }, '-=0.25')
    tl.from('.empty-state', { scale: 0.97, autoAlpha: 0, duration: 0.5 }, '-=0.15')
  }, pageRef.value)
})

onUnmounted(() => { pageCtx?.revert() })

watch(hasData, async (val) => {
  if (!val) return
  await nextTick()
  pageCtx?.revert()
  pageCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.summary-card', { y: 20, autoAlpha: 0, duration: 0.4, stagger: 0.05 })
    tl.from('.chart-box', { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.07 }, '-=0.15')
    tl.from('.section-row', { y: 10, autoAlpha: 0, duration: 0.35 }, '-=0.1')
    tl.from('.table-box', { y: 14, autoAlpha: 0, duration: 0.4 }, '-=0.08')
  }, pageRef.value)
})

watch(sortBy, async () => {
  if (!hasData.value) return
  await nextTick()
  pageCtx?.revert()
  pageCtx = gsap.context(() => {
    gsap.from('.el-table__body-wrapper tbody tr', { autoAlpha: 0, y: 4, duration: 0.22, stagger: 0.01, ease: 'power2.out' })
  }, pageRef.value)
})

async function fetchData() {
  loading.value = true; errorMsg.value = ''
  const days = period.value === 'month' ? 30 : 7
  try {
    const allVideos = []
    for (let p = 1; p <= 2; p++) {
      const { list, noMore } = await fetchPopularVideos(p, 50)
      allVideos.push(...list)
      if (noMore) break
    }
    const seen = new Set()
    const unique = allVideos.filter(v => { if (seen.has(v.bvid)) return false; seen.add(v.bvid); return true })
    videos.value = filterByPeriod(unique, days).map(classifyVideo)
    categoryStats.value = getCategoryStats(videos.value)
    hasData.value = true
  } catch (err) { errorMsg.value = err.message || '获取数据失败'; console.error(err) }
  finally { loading.value = false }
}
</script>

<template>
  <div class="home" ref="pageRef">
    <!-- ═══ Header ═══ -->
    <header class="page-header">
      <div class="header-top">
        <div class="header-text">
          <p class="eyebrow">BILIBILI TRENDING</p>
          <h1>短视频趋势分析</h1>
          <p class="header-desc">实时追踪 B 站热门视频，智能分类，一键导出数据报表</p>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <!-- ═══ Controls ═══ -->
    <FilterPanel
      v-model:platform="platform" v-model:period="period"
      v-model:sort-by="sortBy" :loading="loading" @search="fetchData"
    />

    <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon closable @close="errorMsg = ''" />

    <!-- ═══ Data ═══ -->
    <template v-if="hasData && !errorMsg">
      <SummaryCard :videos="sortedVideos" :category-stats="categoryStats" />
      <DataChart :category-stats="categoryStats" />

      <div class="section-row">
        <h3 class="section-heading">数据详情</h3>
        <ExportButton :videos="sortedVideos" :category-stats="categoryStats"
          :period="period" :platform="platform" :disabled="!sortedVideos.length" />
      </div>

      <DataTable :videos="sortedVideos" :sort-by="sortBy" />
    </template>

    <div v-else-if="!loading && !errorMsg" class="empty-state">
      <span class="empty-icon">▣</span>
      <p>选择条件，点击「获取数据」开始分析</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 32px 64px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  min-height: 100vh;
}

/* ── Header ── */
.page-header { padding-bottom: 8px; }
.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.header-text { flex: 1; }
.eyebrow {
  margin: 0;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--accent);
}
.page-header h1 {
  margin: 12px 0 0;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1.15;
}
.header-desc {
  margin: 12px 0 0;
  font-size: 17px;
  color: var(--ink-subtle);
  font-weight: 400;
  line-height: 1.5;
}

/* ── Section ── */
.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.02em;
}

/* ── Empty ── */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: var(--ink-subtle);
}
.empty-icon { font-size: 36px; display: block; margin-bottom: 20px; color: var(--hairline-strong); }
.empty-state p { font-size: 15px; margin: 0; }
</style>
