import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAllVideos } from './services/bilibili.js'
import { classifyVideo, getCategoryStats, filterByPeriod } from './services/classifier.js'
import { generateExcel } from './services/excel.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Serve static frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// GET /api/videos — fetch and analyze videos
app.get('/api/videos', async (req, res) => {
  try {
    const period = req.query.period || 'week'
    const platform = req.query.platform || 'bilibili'
    const days = period === 'month' ? 30 : 7

    let videos = await getAllVideos(100)
    videos = filterByPeriod(videos, days)
    videos = videos.map(classifyVideo)

    const categoryStats = getCategoryStats(videos)

    res.json({
      code: 0,
      data: {
        platform,
        period,
        total: videos.length,
        videos,
        categoryStats,
      },
    })
  } catch (err) {
    console.error('Fetch error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// GET /api/export — generate and download Excel
app.get('/api/export', async (req, res) => {
  try {
    const period = req.query.period || 'week'
    const platform = req.query.platform || 'bilibili'
    const days = period === 'month' ? 30 : 7

    let videos = await getAllVideos(100)
    videos = filterByPeriod(videos, days)
    videos = videos.map(classifyVideo)
    const categoryStats = getCategoryStats(videos)

    const buffer = await generateExcel({ videos, categoryStats, period, platform })

    const filename = `${platform}_${period}_${Date.now()}.xlsx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(buffer)
  } catch (err) {
    console.error('Export error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
