import { google } from "googleapis";
import type { CalendarData, CalendarEvent, TeamMember } from "./types.ts";
import { EventType } from "./types.ts";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

interface TeamMemberConfig {
  id: string;
  name: string;
  email: string;
}

const TEAM_MEMBERS: TeamMemberConfig[] = [
  { id: "1", name: "Francisco", email: "francisco@datawheel.us" },
  { id: "2", name: "Felipe", email: "felipe@datawheel.us" },
  { id: "3", name: "Samuel", email: "samuel@datawheel.us" },
];

interface Credentials {
  email: string;
  key: string;
}

async function getCredentials(): Promise<Credentials> {
  const keyPath =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyPath) {
    const { readFile } = await import("node:fs/promises");
    const content = JSON.parse(await readFile(keyPath, "utf-8"));
    return { email: content.client_email, key: content.private_key };
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (email && key) {
    return { email, key: key.replace(/\\n/g, "\n") };
  }

  throw new Error(
    "Google service account not configured.\n" +
      "Provide a JSON key file via GOOGLE_SERVICE_ACCOUNT_KEY_PATH " +
      "(or GOOGLE_APPLICATION_CREDENTIALS),\n" +
      "or set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
  );
}

function mapEventType(gcalItem: { eventType?: string; transparency?: string }): EventType {
  if (gcalItem.eventType === "outOfOffice") return EventType.OutOfOffice;
  if (gcalItem.eventType === "focusTime") return EventType.Focus;
  if (gcalItem.transparency === "transparent") return EventType.OutOfOffice;
  return EventType.Meeting;
}

export async function fetchCalendarData(date: string): Promise<CalendarData> {
  const creds = await getCredentials();

  const startOfDay = new Date(date + "T00:00:00Z");
  const endOfDay = new Date(date + "T23:59:59Z");

  const members: TeamMember[] = TEAM_MEMBERS.map(({ id, name }) => ({ id, name }));
  const events: CalendarEvent[] = [];

  const auth = new google.auth.JWT({ email: creds.email, key: creds.key, scopes: SCOPES });

  const calendar = google.calendar({ version: "v3", auth });

  for (const member of TEAM_MEMBERS) {
    try {
      const response = await calendar.events.list({
        calendarId: member.email,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      for (const item of response.data.items ?? []) {
        const startMs = item.start?.dateTime
          ? new Date(item.start.dateTime).getTime()
          : item.start?.date
            ? new Date(item.start.date + "T00:00:00Z").getTime()
            : 0;

        const endMs = item.end?.dateTime
          ? new Date(item.end.dateTime).getTime()
          : item.end?.date
            ? new Date(item.end.date + "T00:00:00Z").getTime()
            : 0;

        if (!startMs || !endMs) continue;

        events.push({
          id: item.id ?? `gcal-${member.id}-${startMs}`,
          title: item.summary || "(No title)",
          startTime: startMs,
          endTime: endMs,
          type: mapEventType(item),
          userId: member.id,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch calendar for ${member.name} (${member.email}):`, err);
    }
  }

  return { date, members, events };
}
