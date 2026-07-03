import type { CalendarAdapter, CalendarData } from '../data/model.ts'

export class GoogleApiAdapter implements CalendarAdapter {
  private readonly baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  async fetch(date: string): Promise<CalendarData> {
    const res = await fetch(`${this.baseUrl}/calendar?date=${date}`)
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Calendar API error (${res.status}): ${body}`)
    }
    return res.json() as Promise<CalendarData>
  }
}
