export function getDaysAgo(days) {
  return Math.floor(Date.now() / 1000) - days * 86400
}

export function formatDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('zh-CN')
}

export function formatDateTime(ts) {
  return new Date(ts * 1000).toLocaleString('zh-CN')
}

export function formatNumber(n) {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}
