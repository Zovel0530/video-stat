/**
 * Vercel Serverless Function — B站 API 代理
 * 将 /api/* 请求转发到 api.bilibili.com，自动注入浏览器伪装头
 */
export default async function handler(req, res) {
  // 解析 URL，提取 /api 之后的路径和参数
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const apiPath = parsed.pathname.replace(/^\/api/, '') || '/'
  const target = `https://api.bilibili.com${apiPath}${parsed.search}`

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        Referer: 'https://www.bilibili.com',
        Origin: 'https://www.bilibili.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        // 透传客户端 Accept，确保响应格式正确
        Accept: req.headers.accept || '*/*',
      },
    })

    const body = await response.arrayBuffer()

    // 设置跨域头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // 透传 B站 返回的 Content-Type
    const ct = response.headers.get('content-type')
    if (ct) res.setHeader('Content-Type', ct)

    res.status(response.status).send(Buffer.from(body))
  } catch (err) {
    console.error('API proxy error:', err.message)
    res.status(502).json({ code: -1, message: '代理请求失败: ' + err.message })
  }
}
