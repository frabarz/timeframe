export const EventType = {
  Meeting: 'meeting',
  Focus: 'focus',
  OutOfOffice: 'ooo',
} as const

export type EventType = (typeof EventType)[keyof typeof EventType]

export interface CalendarEvent {
  id: string
  title: string
  startTime: number
  endTime: number
  type: EventType
  userId: string
}

export interface TeamMember {
  id: string
  name: string
}

export interface CalendarData {
  date: string
  members: TeamMember[]
  events: CalendarEvent[]
}

export interface CalendarAdapter {
  fetch(date: string): Promise<CalendarData>
}
