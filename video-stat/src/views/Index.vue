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

// 页面根元素
const pageRef = ref(null)
let pageCtx

// 按选择的排序依据对视频列表排序（降序）
const sortedVideos = computed(() => {
  const list = [...videos.value]
  list.sort((a, b) => (b[sortBy.value] || 0) - (a[sortBy.value] || 0))
  return list
})

// 页面首次加载动画
onMounted(() => {
  pageCtx = gsap.context(() => {
    // Header 从上方滑入
    gsap.from('.app-header', {
      y: -40,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    // FilterPanel 延迟淡入
    gsap.from('.filter-panel', {
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out',
    })
    // 空状态弹性入场
    gsap.from('.empty-state', {
      scale: 0.9,
      autoAlpha: 0,
      duration: 0.7,
      delay: 0.3,
      ease: 'back.out(1.4)',
    })
  }, pageRef.value)
})

onUnmounted(() => {
  pageCtx?.revert()
})

// 数据加载后，动画展示结果区域
watch(hasData, async (val) => {
  if (!val) return
  await nextTick()
  // 清理页面初始 context，为数据区动画创建新 context
  pageCtx?.revert()
  pageCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    // 概览卡片依次弹出
    tl.from('.summary-row .summary-card', {
      y: 30,
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.08,
    })
    // 图表区域淡入
    tl.from('.chart-row', {
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
    }, '-=0.2')
    // 导出栏 & 表格
    tl.from('.export-row', {
      y: 16,
      autoAlpha: 0,
      duration: 0.4,
    }, '-=0.2')
    tl.from('.table-box', {
      y: 20,
      autoAlpha: 0,
      duration: 0.5,
    }, '-=0.1')
  }, pageRef.value)
})

async function fetchData() {
  loading.value = true
  errorMsg.value = ''
  const days = period.value === 'month' ? 30 : 7

  try {
    const allVideos = []
    // Fetch 2 pages to get ~100 videos
    for (let p = 1; p <= 2; p++) {
      const { list, noMore } = await fetchPopularVideos(p, 50)
      allVideos.push(...list)
      if (noMore) break
    }

    // Deduplicate
    const seen = new Set()
    const unique = allVideos.filter(v => {
      if (seen.has(v.bvid)) return false
      seen.add(v.bvid)
      return true
    })

    // Filter by period, classify
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
    <header class="app-header">
      <h1>短视频趋势分析</h1>
      <p class="subtitle">B站热门视频排行榜 · 类型分析与数据导出</p>
    </header>

    <FilterPanel
      v-model:platform="platform"
      v-model:period="period"
      v-model:sort-by="sortBy"
      :loading="loading"
      @search="fetchData"
    />

    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      closable
      style="margin-top: 16px"
      @close="errorMsg = ''"
    />

    <template v-if="hasData && !errorMsg">
      <SummaryCard :videos="sortedVideos" :category-stats="categoryStats" />
      <DataChart :category-stats="categoryStats" />

      <div class="export-row">
        <h3 style="margin: 0">数据详情</h3>
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

    <div v-else-if="!loading && !errorMsg" class="empty-state">
      <div class="empty-icon">📈</div>
      <p>选择平台和时间范围，点击「获取数据」查看热门视频排行</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.app-header {
  text-align: center;
  padding: 24px 0 8px;
}
.app-header h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
  font-weight: 700;
}
.subtitle {
  margin: 8px 0 0;
  color: #909399;
  font-size: 14px;
}
.export-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #909399;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
</style>
