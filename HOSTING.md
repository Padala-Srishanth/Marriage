# Poornachander & Thanvika Wedding Invitation

## Correct details or add photographs
Everything the family supplied is in `src/data/wedding.ts`: names, venue, map link and photographs.
Put photographs in `public/` (for example `public/groom.jpg`) and set `photo: 'groom.jpg'`.
Translations are in `src/i18n/strings.ts`.

## Run it locally
    npm install
    npm run dev

## Put it online for guests
1. Build it, using the final web address so WhatsApp can show the preview image:

       $env:VITE_SITE_URL="https://your-address.netlify.app/"; npm run build

2. Upload the `dist` folder to any static host, such as Netlify Drop (https://app.netlify.com/drop).
