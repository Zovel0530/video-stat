import request from './request.js'

export function fetchPopularVideos(page = 1, pageSize = 50) {
  return request.get('/x/web-interface/popular', {
    params: { pn: page, ps: pageSize },
  }).then(res => {
    const list = (res.data?.list || []).map(formatVideo)
    return { list, noMore: res.data?.no_more }
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
