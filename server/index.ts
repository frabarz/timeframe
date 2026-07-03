import express from 'express'
import type { CalendarData } from './types.ts'
import { fetchCalendarData } from './calendarApi.ts'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.get('/api/calendar', async (_req, res) => {
  const date = (_req.query.date as string) || new Date().toISOString().slice(0, 10)
  try {
    const data: CalendarData = await fetchCalendarData(date)
    res.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Calendar API error:', message)
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`Timeframe server running on http://localhost:${PORT}`)
})
