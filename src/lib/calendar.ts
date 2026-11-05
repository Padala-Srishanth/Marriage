import { wedding } from '../data/wedding'

const title = 'Wedding of Poornachander & Thanvika'
const description = "Lenkala's Wedding Invitation. Muhurtham at 10:04 AM IST, Dhanur Lagnam. Lunch follows the marriage."

// 2026-11-21T04:34:00.000Z -> 20261121T043400Z
function toUtcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function eventRange() {
  const start = wedding.muhurtham
  const end = new Date(start.getTime() + wedding.calendarMinutes * 60_000)
  return { start: toUtcStamp(start), end: toUtcStamp(end) }
}

export function googleCalendarUrl() {
  const { start, end } = eventRange()
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    ctz: 'Asia/Kolkata',
    details: description,
    location: wedding.venue.query,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1')
}

export function icsContent() {
  const { start, end } = eventRange()
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lenkala Wedding//Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:poornachander-thanvika-20261121@lenkala-wedding',
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(wedding.venue.query)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

export function downloadIcs() {
  const url = URL.createObjectURL(new Blob([icsContent()], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'poornachander-thanvika-wedding.ics'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
