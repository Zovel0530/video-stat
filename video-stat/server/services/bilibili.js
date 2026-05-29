const BILIBILI_API = 'https://api.bilibili.com'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://www.bilibili.com',
}

async function fetchFromBilibili(path) {
  const url = `${BILIBILI_API}${path}`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Bilibili API error: ${res.status}`)
  const json = await res.json()
  if (json.code !== 0) throw new Error(`Bilibili API code: ${json.code} — ${json.message}`)
  return json.data
}

export async function fetchPopularVideos(page = 1, pageSize = 50) {
  const data = await fetchFromBilibili(
    `/x/web-interface/popular?pn=${page}&ps=${pageSize}`
  )
  return (data.list || []).map(formatVideo)
}

export async function fetchRankingVideos(rid = 0, type = 'all') {
  const data = await fetchFromBilibili(
    `/x/web-interface/ranking/v2?rid=${rid}&type=${type}`
  )
  return (data.list || []).map(formatVideo)
}

export async function fetchVideoTags(bvid) {
  const data = await fetchFromBilibili(`/x/web-interface/view/detail?bvid=${bvid}`)
  const detail = data.View || {}
  return {
    tags: (detail.tid_list || []).map(t => t.name || t),
    tname: detail.tname || '',
    tid: detail.tid || 0,
  }
}

function formatVideo(v) {
  return {
    bvid: v.bvid || '',
    aid: v.aid,
    title: v.title || '',
    pic: v.pic || '',
    owner: v.owner?.name || '',
    mid: v.owner?.mid,
    view: v.stat?.view || 0,
    danmaku: v.stat?.danmaku || 0,
    reply: v.stat?.reply || 0,
    favorite: v.stat?.favorite || 0,
    coin: v.stat?.coin || 0,
    share: v.stat?.share || 0,
    like: v.stat?.like || 0,
    tname: v.tname || '',
    tid: v.tid || 0,
    pubdate: v.pubdate || 0,
    duration: v.duration || '',
    desc: v.desc || '',
  }
}

export async function getAllVideos(count = 100) {
  const videos = []
  const pages = Math.ceil(count / 50)

  for (let p = 1; p <= pages; p++) {
    const batch = await fetchPopularVideos(p, 50)
    videos.push(...batch)
    if (batch.length < 50) break
  }

  // Deduplicate by bvid
  const seen = new Set()
  return videos.filter(v => {
    if (seen.has(v.bvid)) return false
    seen.add(v.bvid)
    return true
  }).slice(0, count)
}
