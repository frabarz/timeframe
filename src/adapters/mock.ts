import type { CalendarAdapter, CalendarData, CalendarEvent, TeamMember } from '../data/model.ts'
import { EventType } from '../data/model.ts'

const MEMBERS: TeamMember[] = [
  { id: '1',  name: 'Sharon'   },
  { id: '2',  name: 'Caleb'    },
  { id: '3',  name: 'Bob'      },
  { id: '4',  name: 'George'   },
  { id: '5',  name: 'Piotr'    },
  { id: '6',  name: 'Nalin'    },
  { id: '7',  name: 'Faaum'    },
  { id: '8',  name: 'Routu'    },
  { id: '9',  name: 'Taum'     },
  { id: '10', name: 'Arkadi'   },
  { id: '11', name: 'Maria'    },
  { id: '12', name: 'James'    },
  { id: '13', name: 'Aisha'    },
  { id: '14', name: 'Lena'     },
  { id: '15', name: 'Diego'    },
  { id: '16', name: 'Yuki'     },
  { id: '17', name: 'Sofia'    },
  { id: '18', name: 'Elena'    },
  { id: '19', name: 'Hiro'     },
  { id: '20', name: 'Zara'     },
]

const EVENT_TEMPLATES = [
  { title: 'Daily standup',     type: EventType.Meeting },
  { title: 'Sprint planning',   type: EventType.Meeting },
  { title: 'Design review',     type: EventType.Meeting },
  { title: '1:1 with manager',  type: EventType.Meeting },
  { title: 'Lunch',             type: EventType.OutOfOffice },
  { title: 'Focus time',        type: EventType.Focus },
  { title: 'Code review',       type: EventType.Focus },
  { title: 'Client call',       type: EventType.Meeting },
  { title: 'Workshop',          type: EventType.Meeting },
  { title: 'Docs writing',      type: EventType.Focus },
  { title: 'QA sync',           type: EventType.Meeting },
  { title: 'Backlog grooming',  type: EventType.Meeting },
  { title: 'Research',          type: EventType.Focus },
  { title: 'Team retro',        type: EventType.Meeting },
  { title: 'Prototyping',       type: EventType.Focus },
  { title: 'All-hands',         type: EventType.Meeting },
  { title: 'Prod incident',     type: EventType.Meeting },
  { title: 'Pair programming',  type: EventType.Focus },
  { title: 'Onboarding session',type: EventType.Meeting },
  { title: 'DDD event',         type: EventType.OutOfOffice },
]

function ms(h: number, m: number = 0): number {
  return (h * 60 + m) * 60 * 1000
}

function todayMs() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function buildEvents(): CalendarEvent[] {
  const base = todayMs()
  const events: CalendarEvent[] = []
  let id = 0

  for (const member of MEMBERS) {
    const numEvents = 1 + Math.floor(Math.random() * 3)
    const used: number[] = []

    for (let e = 0; e < numEvents; e++) {
      const slot = 8 + Math.floor(Math.random() * 9)
      if (used.includes(slot)) continue
      used.push(slot)

      const tpl = EVENT_TEMPLATES[(id + e * 3) % EVENT_TEMPLATES.length]
      const startH = slot
      const duration = 0.25 + Math.random() * 1.5
      const endH = Math.min(startH + duration, 18)
      const endM = Math.round((endH - Math.floor(endH)) * 60)

      events.push({
        id: `e${id++}`,
        title: tpl.title,
        type: tpl.type,
        userId: member.id,
        startTime: base + ms(slot),
        endTime: base + ms(Math.floor(startH + duration), endM),
      })
    }
  }

  return events
}

export class MockAdapter implements CalendarAdapter {
  async fetch(_date: string): Promise<CalendarData> {
    const today = new Date()
    const date = today.toISOString().slice(0, 10)
    return { date, members: MEMBERS, events: buildEvents() }
  }
}
