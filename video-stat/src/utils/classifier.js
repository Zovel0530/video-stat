// Bilibili partition ID → category name
const PARTITION_MAP = {
  1: '动画', 13: '番剧', 167: '国创', 3: '音乐', 129: '舞蹈',
  4: '游戏', 36: '知识', 188: '科技', 234: '运动', 223: '汽车',
  160: '生活', 211: '美食', 217: '动物圈', 119: '鬼畜', 155: '时尚',
  5: '娱乐', 181: '影视', 177: '纪录片', 23: '电影', 11: '电视剧',
}

// 匹配优先级从上到下：更具体的分类放在前面，避免被宽泛分类吞掉
const CATEGORY_GROUPS = {
  '搞笑': ['搞笑'],
  '日常': ['日常'],
  '三农': ['三农'],
  '综合': ['综合'],
  '游戏': ['游戏'],
  '音乐舞蹈': ['音乐', '舞蹈', '翻唱', 'VOCALOID', 'UTAU', '乐评盘点'],
  '动画': ['动画', '鬼畜', '同人', '手书', '动漫', '配音', 'GMV', 'MMD'],
  '影视娱乐': ['娱乐', '影视', '电影', '电视剧', '番剧', '国创', '综艺', '明星', '特摄', '预告', '资讯'],
  '知识科技': ['知识', '科技', '纪录片', '科学科普', '计算机', '极客DIY', '设计', '创意', '人文历史', '社科', '法律', '心理', '数码'],
  '生活': ['生活', '美食', '时尚', '运动', '汽车', '动物圈', '出行', '手工', '仿妆cos', '篮球', '足球', '喵星人', '野生动物'],
}

export function classifyVideo(video) {
  const tname = video.tname || PARTITION_MAP[video.tid] || '其他'
  const group = findGroup(tname)
  return { ...video, tname, categoryGroup: group }
}

function findGroup(tname) {
  for (const [group, members] of Object.entries(CATEGORY_GROUPS)) {
    if (members.some(m => tname.includes(m))) return group
  }
  return '其他'
}

export function getCategoryStats(videos) {
  const stats = {}
  for (const v of videos) {
    const cat = v.categoryGroup || v.tname || '其他'
    if (!stats[cat]) stats[cat] = { count: 0, view: 0, like: 0, reply: 0, danmaku: 0, share: 0 }
    stats[cat].count++
    stats[cat].view += v.view
    stats[cat].like += v.like
    stats[cat].reply += v.reply
    stats[cat].danmaku += v.danmaku
    stats[cat].share += v.share
  }
  return Object.entries(stats)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.view - a.view)
}

export function filterByPeriod(videos, days) {
  const cutoff = Math.floor(Date.now() / 1000) - days * 86400
  return videos.filter(v => v.pubdate >= cutoff)
}
