import * as XLSX from 'xlsx'

export function exportToExcel({ videos, categoryStats, period, platform }) {
  const wb = XLSX.utils.book_new()

  const videoData = videos.map((v, i) => ({
    '排名': i + 1,
    '视频标题': v.title,
    'UP主': v.owner,
    '分区': v.tname,
    '分类': v.categoryGroup || v.tname,
    '播放量': v.view,
    '点赞': v.like,
    '评论': v.reply,
    '弹幕': v.danmaku,
    '分享': v.share,
    '发布时间': new Date(v.pubdate * 1000).toLocaleString('zh-CN'),
    'BV号': v.bvid,
  }))
  const ws1 = XLSX.utils.json_to_sheet(videoData)
  ws1['!cols'] = [
    { wch: 6 }, { wch: 40 }, { wch: 14 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 20 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, ws1, '视频列表')

  const totalView = categoryStats.reduce((s, c) => s + c.view, 0)
  const catData = categoryStats.map(c => ({
    '视频类型': c.name,
    '视频数量': c.count,
    '总播放量': c.view,
    '总点赞': c.like,
    '总评论': c.reply,
    '总弹幕': c.danmaku,
    '总分享': c.share,
    '平均播放量': Math.round(c.view / c.count),
    '播放占比': totalView ? ((c.view / totalView) * 100).toFixed(1) + '%' : '0%',
  }))
  const ws2 = XLSX.utils.json_to_sheet(catData)
  ws2['!cols'] = [
    { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
  ]
  XLSX.utils.book_append_sheet(wb, ws2, '分类分析')

  const topCat = categoryStats[0]
  const summary = [
    ['平台', platform === 'bilibili' ? 'B站' : '抖音'],
    ['时间范围', period === 'week' ? '近7天' : '近30天'],
    ['视频总数', videos.length],
    ['总播放量', videos.reduce((s, v) => s + v.view, 0)],
    ['总点赞数', videos.reduce((s, v) => s + v.like, 0)],
    ['最热分类', topCat?.name || '无'],
    ['最热分类播放量', topCat?.view || 0],
    ['生成时间', new Date().toLocaleString('zh-CN')],
  ]
  const ws3 = XLSX.utils.aoa_to_sheet(summary)
  ws3['!cols'] = [{ wch: 18 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, ws3, '数据概览')

  const name = `${platform}_${period}_${Date.now()}.xlsx`
  XLSX.writeFile(wb, name)
}
