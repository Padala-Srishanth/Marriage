// Every family-supplied fact lives here. Edit this file to correct a name,
// add photographs or swap in a recorded music track.

const venueQuery = 'C.C. Gardens, Karimnagar Road, Siddipet, Telangana'

export const wedding = {
  groom: { short: 'Purnachander', formal: 'Ch. Purnachander', monogram: 'P', photo: '' },
  bride: { short: 'Thanvika', formal: 'Ch. La. Sow. Thanvika', monogram: 'T', photo: '' },
  brideParents: 'Smt. & Sri. Poshinashetty Vanitha – Srinivas, Siddipet',
  hosts: 'Lenkala Krishnaveni – Srinivas',
  elders: ['Lenkala Sattevva – Balakistaiah', 'Gopu Narsavva – Prathap'],

  // 10:04 AM India Standard Time
  muhurtham: new Date('2026-11-21T10:04:00+05:30'),

  // Google Calendar and .ics events need an end time. The invitation gives
  // none, so guests' calendars block this many minutes.
  calendarMinutes: 120,

  venue: {
    name: 'C.C. Gardens',
    address: 'Karimnagar Road, Siddipet, Telangana',
    query: venueQuery,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueQuery)}`,
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(venueQuery)}&z=15&output=embed`,
  },

  // What the share buttons send when the page runs inside the Claude preview.
  // Once hosted on its own address, they send that address instead.
  previewUrl: 'https://claude.ai/artifact/9r77vinhpTt8ijch7xEXrZ',

  // Path to an .mp3 in /public, for example 'music.mp3'. Left empty, the site
  // plays its own generated flute and tanpura piece.
  musicUrl: '',
}
