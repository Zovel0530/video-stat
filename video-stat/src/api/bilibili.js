import request from './request.js'

// B站 API 返回格式：{ code: 0, message: "OK", data: ... }
// code !== 0 表示业务错误（鉴权、参数等），需要当做异常处理
function checkCode(res) {
  if (res.code !== 0) {
    throw new Error(`B站 API 错误 (code=${res.code}): ${res.message || '未知错误'}`)
  }
  return res
}

export function fetchPopularVideos(page = 1, pageSize = 50) {
  return request.get('/x/web-interface/popular', {
    params: { pn: page, ps: pageSize },
  }).then(checkCode).then(res => {
    const list = (res.data?.list || []).map(formatVideo)
    return { list, noMore: res.data?.no_more }
  })
}

// 获取每周排行榜归档列表
export function fetchWeeklySeriesList() {
  return request.get('/x/web-interface/popular/series/list').then(checkCode).then(res => {
    // /series/list 的 data 可能是 { list: [...] } 或直接是数组
    const list = Array.isArray(res.data) ? res.data : (res.data?.list || [])
    return list.sort((a, b) => b.number - a.number)
  })
}

// 获取某一周的排行榜数据（⚠️ 需要登录 Cookie，否则返回 -352）
export function fetchWeeklySeriesOne(number) {
  return request.get('/x/web-interface/popular/series/one', {
    params: { number },
  }).then(checkCode).then(res => {
    const list = (res.data?.list || []).map(formatVideo)
    return { list, number, name: res.data?.config?.name || '' }
  })
}

export function fetchVideoDetail(bvid) {
  return request.get('/x/web-interface/view/detail', {
    params: { bvid },
  }).then(res => {
    const detail = res.data?.View || {}
    return {
      tags: (detail.tid_list || []).map(t => t.name || t),
    }
  })
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
