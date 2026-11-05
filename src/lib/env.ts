// True when the page runs inside another page's frame, such as a private preview.
// Such frames block map embeds and file downloads.
export const isFramed = window.self !== window.top
