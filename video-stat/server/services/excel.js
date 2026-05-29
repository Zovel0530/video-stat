import ExcelJS from 'exceljs'

export async function generateExcel(analysisData) {
  const { videos, categoryStats, period, platform } = analysisData
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Video Trend Analyzer'

  // Sheet 1: Video list
  const sheet1 = workbook.addWorksheet('视频列表')
  sheet1.columns = [
    { header: '排名', key: 'rank', width: 8 },
    { header: '视频标题', key: 'title', width: 40 },
    { header: 'UP主', key: 'owner', width: 16 },
    { header: '分区', key: 'tname', width: 12 },
    { header: '分类', key: 'category', width: 12 },
    { header: '播放量', key: 'view', width: 14 },
    { header: '点赞', key: 'like', width: 10 },
    { header: '评论', key: 'reply', width: 10 },
    { header: '弹幕', key: 'danmaku', width: 10 },
    { header: '分享', key: 'share', width: 10 },
    { header: '发布时间', key: 'pubdate', width: 20 },
    { header: 'BV号', key: 'bvid', width: 14 },
  ]

  videos.forEach((v, i) => {
    sheet1.addRow({
      rank: i + 1,
      title: v.title,
      owner: v.owner,
      tname: v.tname,
      category: v.categoryGroup || v.tname,
      view: v.view,
      like: v.like,
      reply: v.reply,
      danmaku: v.danmaku,
      share: v.share,
      pubdate: new Date(v.pubdate * 1000).toLocaleString('zh-CN'),
      bvid: v.bvid,
    })
  })

  // Style header
  sheet1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  sheet1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF409EFF' } }
  sheet1.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }

  // Sheet 2: Category analysis
  const sheet2 = workbook.addWorksheet('分类分析')
  sheet2.columns = [
    { header: '视频类型', key: 'name', width: 16 },
    { header: '视频数量', key: 'count', width: 12 },
    { header: '总播放量', key: 'view', width: 16 },
    { header: '总点赞', key: 'like', width: 14 },
    { header: '总评论', key: 'reply', width: 12 },
    { header: '总弹幕', key: 'danmaku', width: 12 },
    { header: '总分享', key: 'share', width: 12 },
    { header: '平均播放量', key: 'avgView', width: 14 },
    { header: '播放占比', key: 'viewRatio', width: 12 },
  ]

  const totalView = categoryStats.reduce((s, c) => s + c.view, 0)
  categoryStats.forEach(c => {
    sheet2.addRow({
      name: c.name,
      count: c.count,
      view: c.view,
      like: c.like,
      reply: c.reply,
      danmaku: c.danmaku,
      share: c.share,
      avgView: Math.round(c.view / c.count),
      viewRatio: ((c.view / totalView) * 100).toFixed(1) + '%',
    })
  })

  sheet2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  sheet2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF67C23A' } }
  sheet2.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }

  // Sheet 3: Summary
  const sheet3 = workbook.addWorksheet('数据概览')
  const totalVideos = videos.length
  const totalViews = videos.reduce((s, v) => s + v.view, 0)
  const totalLikes = videos.reduce((s, v) => s + v.like, 0)
  const topCategory = categoryStats[0]

  sheet3.addRow(['平台', platform === 'bilibili' ? 'B站' : '抖音'])
  sheet3.addRow(['时间范围', period === 'week' ? '近7天' : '近30天'])
  sheet3.addRow(['视频总数', totalVideos])
  sheet3.addRow(['总播放量', totalViews])
  sheet3.addRow(['总点赞数', totalLikes])
  sheet3.addRow(['最热分类', topCategory?.name || '无'])
  sheet3.addRow(['最热分类播放量', topCategory?.view || 0])
  sheet3.addRow(['生成时间', new Date().toLocaleString('zh-CN')])

  sheet3.getColumn(1).font = { bold: true }
  sheet3.getColumn(1).width = 20
  sheet3.getColumn(2).width = 30

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
