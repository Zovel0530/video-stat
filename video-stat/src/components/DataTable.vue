<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { formatNumber, formatDateTime } from '../utils/date.js'

const props = defineProps({
  videos: Array,
  sortBy: String,
})

const container = ref(null)
let ctx

// 监听数据变化，动画展示表格行
watch(() => props.videos, async () => {
  await nextTick()
  ctx?.revert()
  if (!container.value) return
  ctx = gsap.context(() => {
    // 表格整体一次性淡入（行交错在大量数据时可能卡顿）
    gsap.from('.el-table__body-wrapper tbody tr', {
      y: 16,
      autoAlpha: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.out',
    })
  }, container.value)
}, { deep: true })

onUnmounted(() => {
  ctx?.revert()
})

const columns = [
  { prop: 'rank', label: '#', width: 60 },
  { prop: 'title', label: '视频标题', minWidth: 240 },
  { prop: 'owner', label: 'UP主', width: 120 },
  { prop: 'tname', label: '分区', width: 90 },
  { prop: 'categoryGroup', label: '分类', width: 90 },
  { prop: 'view', label: '播放量', width: 110 },
  { prop: 'like', label: '点赞', width: 90 },
  { prop: 'reply', label: '评论', width: 80 },
  { prop: 'danmaku', label: '弹幕', width: 80 },
  { prop: 'pubdate', label: '发布时间', width: 160 },
]

const tableData = computed(() =>
  props.videos.map((v, i) => ({
    ...v,
    rank: i + 1,
    viewFmt: formatNumber(v.view),
    likeFmt: formatNumber(v.like),
    replyFmt: formatNumber(v.reply),
    danmakuFmt: formatNumber(v.danmaku),
    pubdateFmt: formatDateTime(v.pubdate),
  }))
)

const defaultSort = computed(() => ({
  prop: props.sortBy || 'view',
  order: 'descending',
}))
</script>

<template>
  <div class="table-box" ref="container">
    <h3 class="table-title">热门视频列表 (共 {{ videos.length }} 条)</h3>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :default-sort="defaultSort"
      max-height="600"
      size="default"
    >
      <el-table-column prop="rank" label="#" width="55" sortable />
      <el-table-column prop="title" label="视频标题" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">
          <a
            :href="`https://www.bilibili.com/video/${row.bvid}`"
            target="_blank"
            class="video-link"
          >{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="owner" label="UP主" width="120" />
      <el-table-column prop="tname" label="分区" width="90" />
      <el-table-column prop="categoryGroup" label="分类" width="90">
        <template #default="{ row }">
          <el-tag size="small" type="primary">{{ row.categoryGroup }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewFmt" label="播放量" width="100" sortable sort-by="view" />
      <el-table-column prop="likeFmt" label="点赞" width="90" sortable sort-by="like" />
      <el-table-column prop="replyFmt" label="评论" width="80" sortable sort-by="reply" />
      <el-table-column prop="danmakuFmt" label="弹幕" width="80" sortable sort-by="danmaku" />
      <el-table-column prop="pubdateFmt" label="发布时间" width="160" sortable sort-by="pubdate" />
    </el-table>
  </div>
</template>

<style scoped>
.table-box {
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--hairline);
  padding: 20px;
  position: relative;
  z-index: 1;
}
.table-title {
  margin: 0 0 16px 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.3px;
}
.video-link {
  color: var(--ink);
  text-decoration: none;
  transition: color 0.2s var(--ease-out);
}
.video-link:hover {
  color: var(--accent);
  text-decoration: underline;
}
</style>
