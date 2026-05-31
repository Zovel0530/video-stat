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

// ── 入场动画 ──
onMounted(() => {
  pageCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    // 标题从上方滑入 + 渐变光晕同步显现
    tl.from('.app-header', {
      y: -60,
      autoAlpha: 0,
      duration: 0.9,
    })
    // FilterPanel 延迟淡入
    tl.from('.filter-panel', {
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
    }, '-=0.3')
    // 空状态弹性入场
    tl.from('.empty-state', {
      scale: 0.92,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'back.out(1.7)',
    }, '-=0.2')
  }, pageRef.value)
})

onUnmounted(() => {
  pageCtx?.revert()
})

// ── 数据加载后动画 ──
watch(hasData, async (val) => {
  if (!val) return
  await nextTick()
  pageCtx?.revert()
  pageCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.summary-card', {
      y: 32,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.5,
      stagger: 0.06,
    })
    tl.from('.chart-box', {
      y: 24,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.1,
    }, '-=0.25')
    tl.from('.export-row', {
      y: 16,
      autoAlpha: 0,
      duration: 0.35,
    }, '-=0.2')
    tl.from('.table-box', {
      y: 24,
      autoAlpha: 0,
      duration: 0.5,
    }, '-=0.1')
  }, pageRef.value)
})

// ── 排序切换动画 ──
let prevSortBy = sortBy.value
watch(sortBy, async (newVal) => {
  if (newVal === prevSortBy || !hasData.value) return
  prevSortBy = newVal
  await nextTick()
  // 排序切换：表格行闪烁重排
  pageCtx?.revert()
  pageCtx = gsap.context(() => {
    gsap.from('.el-table__body-wrapper tbody tr', {
      autoAlpha: 0,
      y: 8,
      duration: 0.3,
      stagger: 0.015,
      ease: 'power2.out',
    })
  }, pageRef.value)
})

async function fetchData() {
  loading.value = true
  errorMsg.value = ''
  const days = period.value === 'month' ? 30 : 7

  try {
    const allVideos = []
    for (let p = 1; p <= 2; p++) {
      const { list, noMore } = await fetchPopularVideos(p, 50)
      allVideos.push(...list)
      if (noMore) break
    }

    const seen = new Set()
    const unique = allVideos.filter(v => {
      if (seen.has(v.bvid)) return false
      seen.add(v.bvid)
      return true
    })

    const filtered = filterByPeriod(unique, days).map(classifyVideo)

    videos.value = filtered
    categoryStats.value = getCategoryStats(filtered)
    hasData.value = true
  } catch (err) {
    errorMsg.value = err.message || '获取数据失败，请检查网络后重试'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="home" ref="pageRef">
    <!-- ═══ Header ═══ -->
    <header class="app-header">
      <div class="header-badge">
        <span class="badge-dot"></span>
        Bilibili Trending
      </div>
      <h1>短视频趋势分析</h1>
      <p class="subtitle">热门视频排行榜 · 类型分析与数据导出</p>
    </header>

    <!-- ═══ Filter Panel ═══ -->
    <FilterPanel
      v-model:platform="platform"
      v-model:period="period"
      v-model:sort-by="sortBy"
      :loading="loading"
      @search="fetchData"
    />

    <!-- ═══ Error ═══ -->
    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      closable
      style="margin-top: 16px"
      @close="errorMsg = ''"
    />

    <!-- ═══ Data Section ═══ -->
    <template v-if="hasData && !errorMsg">
      <SummaryCard :videos="sortedVideos" :category-stats="categoryStats" />
      <DataChart :category-stats="categoryStats" />

      <div class="export-row">
        <h3 class="section-heading">数据详情</h3>
        <ExportButton
          :videos="sortedVideos"
          :category-stats="categoryStats"
          :period="period"
          :platform="platform"
          :disabled="!sortedVideos.length"
        />
      </div>

      <DataTable :videos="sortedVideos" :sort-by="sortBy" />
    </template>

    <!-- ═══ Empty State ═══ -->
    <div v-else-if="!loading && !errorMsg" class="empty-state">
      <div class="empty-visual">
        <span class="empty-glow"></span>
        <span class="empty-icon">📈</span>
      </div>
      <p>选择平台和时间范围，点击「获取数据」查看热门视频排行</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  position: relative;
}

/* ── Header ── */
.app-header {
  text-align: center;
  padding: 40px 0 16px;
  position: relative;
  z-index: 1;
}
.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-muted);
  letter-spacing: 0.4px;
  margin-bottom: 20px;
}
.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse-dot 3s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 0.6; box-shadow: 0 0 4px var(--accent); }
  50% { opacity: 1; box-shadow: 0 0 10px var(--accent); }
}
.app-header h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 2px;
  color: var(--ink);
  line-height: 1.25;
}
.subtitle {
  margin: 12px 0 0;
  color: var(--ink-subtle);
  font-size: 15px;
  font-weight: 400;
  font-family: var(--font-body);
}

/* ── Section Headings ── */
.section-heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.3px;
}

/* ── Export Row ── */
.export-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: var(--ink-subtle);
  position: relative;
  z-index: 1;
}
.empty-visual {
  position: relative;
  display: inline-block;
}
.empty-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);
}
.empty-icon {
  font-size: 56px;
  display: block;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}
.empty-state p {
  font-size: 15px;
  margin: 0;
}
</style>
